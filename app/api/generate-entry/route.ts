import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { template, messages, userContext } = await request.json()

    // Filter only user messages for the entry
    const userResponses = messages
      .filter((msg: any) => msg.type === "user")
      .map((msg: any) => msg.content)
      .join("\n\n")

    const prompt = `You are an AI therapist creating a comprehensive journal entry based on a therapeutic conversation about ${template.replace("-", " ")}.

User context: ${userContext || "Not provided"}

User's responses during the session:
${userResponses}

Create a thoughtful, insightful journal entry that:
1. Summarizes the key themes and insights from the conversation
2. Reflects the user's emotional journey and self-discoveries
3. Identifies patterns or breakthrough moments
4. Offers gentle encouragement and validation
5. Suggests areas for continued reflection or growth
6. Maintains a warm, supportive, and therapeutic tone

Write this as a complete journal entry in first person, as if the user is reflecting on their session. Make it feel personal, insightful, and empowering. Aim for 300-500 words.

Format it with clear paragraphs and natural flow. Begin with something like "Today's journaling session helped me explore..." or "Through today's reflection, I discovered..."`

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"), // Updated to use the new Groq model
      prompt,
      maxTokens: 800,
      temperature: 0.6,
    })

    return NextResponse.json({ entry: text })
  } catch (error) {
    console.error("Entry generation error:", error)
    return NextResponse.json({ error: "Failed to generate journal entry" }, { status: 500 })
  }
}
