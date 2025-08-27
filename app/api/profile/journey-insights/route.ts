import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { createDatabaseService } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const db = createDatabaseService()

    // Get user profile and recent entries with error handling
    let userProfile = null
    let recentEntries = []

    try {
      userProfile = await db.getUserProfile(userId)
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }

    try {
      recentEntries = await db.getRecentJournalEntries(userId, 30)
    } catch (error) {
      console.error("Error fetching recent entries:", error)
    }

    if (!recentEntries || recentEntries.length === 0) {
      return NextResponse.json({
        insights:
          "Start your journaling journey today! Your first entry will unlock personalized insights about your growth and patterns.",
        streak: 0,
        consistency: 0,
        growthTrend: "neutral",
        recommendations: [
          "Write your first journal entry",
          "Set up daily reminders",
          "Explore different question types",
        ],
      })
    }

    // Calculate streak and consistency
    const today = new Date()
    const dates = recentEntries.map((entry) => new Date(entry.created_at).toDateString())
    const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    let streak = 0
    let currentDate = new Date(today)

    for (const dateStr of uniqueDates) {
      const entryDate = new Date(dateStr)
      const diffDays = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === streak) {
        streak++
        currentDate = entryDate
      } else {
        break
      }
    }

    const last7Days = 7
    const entriesLast7Days = uniqueDates.filter((dateStr) => {
      const entryDate = new Date(dateStr)
      const diffDays = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays < last7Days
    }).length

    const consistency = Math.round((entriesLast7Days / last7Days) * 100)

    // Generate AI insights with fallback
    let insights =
      "You're making great progress on your journaling journey! Keep up the consistent practice to unlock deeper insights."

    try {
      const { text } = await generateText({
        model: xai("grok-4", {
          apiKey: process.env.XAI_API_KEY,
        }),
        prompt: `Analyze this user's journaling journey and provide personalized insights:

User Profile: ${userProfile?.description || "No description provided"}
Total Entries: ${recentEntries.length}
Current Streak: ${streak} days
Consistency: ${consistency}% (last 7 days)
Recent Entries: ${recentEntries
          .slice(0, 5)
          .map(
            (entry) =>
              `Date: ${new Date(entry.created_at).toLocaleDateString()}, Content: ${entry.generated_entry?.substring(0, 200) || "No content"}`,
          )
          .join("\n")}

Provide a warm, encouraging 2-3 sentence insight about their journaling journey, highlighting their progress, patterns, or growth. Be specific and personal based on their actual data.`,
      })
      insights = text
    } catch (aiError) {
      console.error("Error generating AI insights:", aiError)
      // Use fallback insights based on data
      if (streak > 0) {
        insights = `You're on a ${streak}-day journaling streak! Your consistency shows real commitment to self-reflection and growth.`
      } else if (consistency > 50) {
        insights = `With ${consistency}% consistency this week, you're building a strong journaling habit. Keep up the great work!`
      }
    }

    // Determine growth trend
    const recentWeek = recentEntries.filter((entry) => {
      const entryDate = new Date(entry.created_at)
      const diffDays = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays < 7
    }).length

    const previousWeek = recentEntries.filter((entry) => {
      const entryDate = new Date(entry.created_at)
      const diffDays = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays >= 7 && diffDays < 14
    }).length

    let growthTrend = "neutral"
    if (recentWeek > previousWeek) growthTrend = "up"
    else if (recentWeek < previousWeek) growthTrend = "down"

    // Generate recommendations
    const recommendations = []
    if (consistency < 50) recommendations.push("Try setting a daily reminder to build consistency")
    if (streak === 0) recommendations.push("Start a new streak by journaling today")
    if (recentEntries.length < 5) recommendations.push("Explore different question types to keep journaling fresh")
    if (consistency > 80) recommendations.push("You're doing great! Consider exploring weekly insights")

    return NextResponse.json({
      insights,
      streak,
      consistency,
      growthTrend,
      recommendations: recommendations.slice(0, 3),
    })
  } catch (error) {
    console.error("Error generating journey insights:", error)
    return NextResponse.json({
      insights:
        "Your journaling journey is just beginning. Every entry is a step toward greater self-awareness and growth.",
      streak: 0,
      consistency: 0,
      growthTrend: "neutral",
      recommendations: ["Start with daily journaling", "Set up reminders", "Explore your thoughts freely"],
    })
  }
}
