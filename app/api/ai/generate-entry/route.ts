import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"
import type { NextRequest } from "next/server"
import { createDatabaseService } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { userId, questions, answers } = await request.json()

    if (!userId || !questions || !answers) {
      return new Response("Missing required fields", { status: 400 })
    }

    // Get user profile for personalization
    const db = createDatabaseService()
    const profile = await db.getUserProfile(userId)

    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    let contextPrompt = `Create a thoughtful, personalized journal entry for ${today} based on these Q&A pairs:\n\n`

    questions.forEach((question: string, index: number) => {
      if (answers[index]?.trim()) {
        contextPrompt += `Q: ${question}\nA: ${answers[index]}\n\n`
      }
    })

    if (profile) {
      contextPrompt += `\nUser context: ${profile.bio || "No additional context"}. `
      contextPrompt += `Writing style preference: ${profile.question_style || "balanced"}. `
    }

    contextPrompt += `
    Write a cohesive, reflective journal entry that:
    1. Weaves together the user's answers naturally
    2. Provides gentle insights and observations
    3. Acknowledges their emotions and experiences
    4. Highlights patterns or growth opportunities
    5. Ends with encouragement or forward-looking thoughts
    6. Uses a warm, supportive tone
    7. Is 3-4 paragraphs long
    
    Format with the date as a header and write in first person as if the user wrote it themselves.`

    const result = streamText({
      model: xai("grok-4", {
        apiKey: process.env.XAI_API_KEY,
      }),
      prompt: contextPrompt,
      system:
        "You are a compassionate journaling assistant who helps people process their thoughts and emotions through reflective writing. Write as if you are the user reflecting on their day.",
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error generating entry:", error)
    return new Response("Failed to generate entry", { status: 500 })
  }
}
