import { type NextRequest, NextResponse } from "next/server"
import { getUserProfile, updateUserProfile, createDatabaseService } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const [profile, stats] = await Promise.all([
      getUserProfile(userId).catch(() => null),
      createDatabaseService()
        .getUserStats(userId)
        .catch(() => ({
          total_entries: 0,
          entries_this_week: 0,
          entries_this_month: 0,
          average_mood: null,
          last_entry_date: null,
          first_entry_date: null,
        })),
    ])

    return NextResponse.json({
      profile: profile || {
        user_id: userId,
        description: "",
        interests: [],
        goals: [],
        journaling_experience: "beginner",
        preferred_question_style: "reflective",
        daily_reminders: true,
        reminder_time: "19:00",
        weekly_insights: true,
        email_notifications: false,
        timezone: "America/New_York",
      },
      stats: stats || {
        total_entries: 0,
        entries_this_week: 0,
        entries_this_month: 0,
        average_mood: null,
        last_entry_date: null,
        first_entry_date: null,
      },
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, profileData, preferences } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const combinedData = {
      ...profileData,
      // Map preferences to database field names
      daily_reminders: preferences?.journalReminders,
      weekly_insights: preferences?.weeklyInsights,
      email_notifications: preferences?.emailNotifications,
      reminder_time: preferences?.reminderTime,
      timezone: preferences?.timezone,
    }

    let updatedUser = null
    if (combinedData) {
      updatedUser = await updateUserProfile(userId, combinedData)
    }

    return NextResponse.json({
      user: updatedUser,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      {
        error: "Failed to update profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
