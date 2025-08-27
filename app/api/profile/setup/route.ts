import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { description, interests, goals, journalingExperience, questionStyle } = await request.json()

    // Get user from session/auth (simplified for now)
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // For now, we'll get the user ID from localStorage on the client side
    // In a real app, you'd validate the session token here
    const body = await request.json()
    const userId = body.userId || request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // Create or update user profile
    await sql`
      INSERT INTO user_profiles (user_id, description, interests, goals, journaling_experience, preferred_question_style)
      VALUES (${userId}, ${description}, ${interests}, ${goals}, ${journalingExperience}, ${questionStyle})
      ON CONFLICT (user_id) DO UPDATE SET
        description = EXCLUDED.description,
        interests = EXCLUDED.interests,
        goals = EXCLUDED.goals,
        journaling_experience = EXCLUDED.journaling_experience,
        preferred_question_style = EXCLUDED.preferred_question_style,
        updated_at = NOW()
    `

    // Mark profile as completed
    await sql`
      UPDATE users 
      SET profile_completed = TRUE 
      WHERE id = ${userId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Profile setup error:", error)
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 })
  }
}
