import { generateObject } from "ai"
import { xai } from "@ai-sdk/xai"
import { z } from "zod"
import type { NextRequest } from "next/server"
import { createDatabaseService } from "@/lib/database"

const WeeklyInsightSchema = z.object({
  summary: z.string().describe("A meaningful 2-3 paragraph summary of the week's journey"),
  keyThemes: z.array(z.string()).describe("3-4 main themes from the week's entries"),
  emotionalTrend: z.enum(["Upward", "Balanced", "Challenging"]).describe("Overall emotional trajectory"),
  growthMoments: z.array(z.string()).describe("Specific instances of growth or resilience"),
  consistencyScore: z.number().min(0).max(100).describe("Consistency score based on entry frequency and depth"),
  emotionalWellnessScore: z.number().min(0).max(100).describe("Emotional wellness score based on content analysis"),
  growthScore: z.number().min(0).max(100).describe("Personal growth score based on insights and progress"),
  writingAnalytics: z.object({
    totalWords: z.number(),
    avgWordsPerEntry: z.number(),
    themeDiversity: z.number(),
    emotionalDepth: z.number().min(0).max(100),
  }),
  lookingAhead: z.string().describe("Encouraging guidance for the upcoming week"),
})

export async function POST(request: NextRequest) {
  try {
    const { userId, weekStart, weekEnd } = await request.json()

    if (!userId || !weekStart || !weekEnd) {
      return new Response("Missing required fields", { status: 400 })
    }

    // Get user profile and weekly entries
    const db = createDatabaseService()
    const profile = await db.getUserProfile(userId)
    const weeklyEntries = await db.getJournalEntriesByDateRange(userId, weekStart, weekEnd)

    if (weeklyEntries.length === 0) {
      return new Response("No entries found for this week", { status: 404 })
    }

    const uniqueDays = new Set()
    weeklyEntries.forEach((entry) => {
      const date = new Date(entry.entry_date || entry.created_at)
      uniqueDays.add(date.toISOString().split("T")[0])
    })
    const daysWithEntries = uniqueDays.size
    const consistencyScore = Math.round((daysWithEntries / 7) * 100)

    // Calculate basic metrics
    const totalWords = weeklyEntries.reduce((total, entry) => {
      const entryText = entry.generated_entry || entry.ai_generated_entry || ""
      return total + entryText.split(" ").length
    }, 0)

    const avgWordsPerEntry = Math.round(totalWords / weeklyEntries.length)

    let contextPrompt = `Analyze this week's ${weeklyEntries.length} journal entries across ${daysWithEntries} days and provide detailed insights:\n\n`

    weeklyEntries.forEach((entry, index) => {
      const entryText = entry.generated_entry || entry.ai_generated_entry || ""
      contextPrompt += `Day ${index + 1} (${entry.entry_date}):\n`
      contextPrompt += `Questions: ${JSON.stringify(entry.questions)}\n`
      contextPrompt += `Answers: ${JSON.stringify(entry.answers)}\n`
      contextPrompt += `Generated Entry: ${entryText}\n\n`
    })

    if (profile) {
      contextPrompt += `User Profile:\n`
      contextPrompt += `Bio: ${profile.description || "No bio provided"}\n`
      contextPrompt += `Interests: ${profile.interests?.join(", ") || "None specified"}\n`
      contextPrompt += `Goals: ${profile.goals?.join(", ") || "None specified"}\n`
      contextPrompt += `Experience Level: ${profile.experience_level || "Beginner"}\n\n`
    }

    contextPrompt += `
    Based on this data, provide:
    1. A meaningful summary that connects the week's experiences and shows understanding of the user's journey
    2. Key themes that emerged from their reflections (be specific to their actual content)
    3. Emotional trend assessment based on the actual emotional content
    4. Specific growth moments you can identify from their entries
    5. Calculated scores based on actual analysis:
       - Consistency: Use ${consistencyScore}% (${daysWithEntries}/7 days with entries)
       - Emotional Wellness: Based on emotional tone and self-awareness in entries
       - Growth: Based on evidence of learning, resilience, and progress
       - Emotional Depth: Based on how deeply they explored their feelings
    6. Writing analytics with the calculated metrics
    7. Forward-looking guidance tailored to their specific situation and goals
    
    Be specific and reference actual content from their entries. Make insights personal and actionable.`

    const result = await generateObject({
      model: xai("grok-4", {
        apiKey: process.env.XAI_API_KEY,
      }),
      prompt: contextPrompt,
      schema: WeeklyInsightSchema,
      system:
        "You are an insightful life coach who provides personalized analysis based on journal entries. Use the provided consistency score and calculate other metrics thoughtfully based on actual content.",
    })

    const enhancedResult = {
      ...result.object,
      consistencyScore,
      writingAnalytics: {
        totalWords,
        avgWordsPerEntry,
        themeDiversity: result.object.keyThemes.length,
        emotionalDepth: result.object.writingAnalytics.emotionalDepth,
      },
    }

    return Response.json(enhancedResult)
  } catch (error) {
    console.error("Error generating insights:", error)
    return new Response("Failed to generate insights", { status: 500 })
  }
}
