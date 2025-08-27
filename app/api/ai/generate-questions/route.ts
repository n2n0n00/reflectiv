import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"
import type { NextRequest } from "next/server"
import { createDatabaseService } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return new Response("User ID is required", { status: 400 })
    }

    // Get user profile for personalization
    const db = createDatabaseService()
    const profile = await db.getUserProfile(userId)

    // Get recent journal entries for context
    const recentEntries = await db.getRecentJournalEntries(userId, 3)

    let contextPrompt = `Generate 6 thoughtful, personalized journaling questions for today. `

    if (profile) {
      contextPrompt += `User context: ${profile.bio || "No bio provided"}. `
      contextPrompt += `Interests: ${profile.interests?.join(", ") || "None specified"}. `
      contextPrompt += `Goals: ${profile.goals?.join(", ") || "None specified"}. `
      contextPrompt += `Experience level: ${profile.experience_level || "beginner"}. `
    }

    if (recentEntries.length > 0) {
      contextPrompt += `Recent journal themes: ${recentEntries
        .map((entry) => entry.ai_insights || "General reflection")
        .join(", ")}. `
    }

    contextPrompt += `
    Create questions that:
    1. Build on previous reflections if available
    2. Match the user's experience level and interests
    3. Encourage deeper self-reflection
    4. Are varied in emotional depth (some light, some deeper)
    5. Help track progress toward their goals
    
    Return exactly 6 questions as a JSON array of strings. No additional text or formatting.`

    const result = streamText({
      model: xai("grok-4", {
        apiKey: process.env.XAI_API_KEY,
      }),
      prompt: contextPrompt,
      system:
        "You are a thoughtful journaling coach who creates personalized, insightful questions that help people reflect and grow. Always return valid JSON.",
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error generating questions:", error)
    return new Response("Failed to generate questions", { status: 500 })
  }
}
