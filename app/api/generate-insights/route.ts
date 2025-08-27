import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { entries, timeframe, templates } = await request.json();

    const entriesText = entries
      .map(
        (entry: any) =>
          `Date: ${entry.date}\nTemplate: ${entry.template}\nEntry: ${entry.content}`
      )
      .join("\n\n---\n\n");

    const prompt = `You are an AI therapist analyzing journal entries to provide insightful weekly summaries and pattern recognition.

Time period: ${timeframe}
Journal templates used: ${templates.join(", ")}

Journal entries:
${entriesText}

Analyze these entries and provide:

1. **Key Themes**: What are the main emotional and psychological themes that emerged this week?

2. **Progress Indicators**: What signs of growth, self-awareness, or positive change can you identify?

3. **Patterns & Triggers**: What recurring patterns, triggers, or situations appear across multiple entries?

4. **Breakthrough Moments**: Highlight any significant insights, realizations, or emotional breakthroughs.

5. **Areas for Continued Focus**: What areas would benefit from continued exploration and attention?

6. **Encouragement & Validation**: Provide supportive observations about the user's journey and efforts.

Format your response as a JSON object with these sections: keyThemes, progressIndicators, patterns, breakthroughs, focusAreas, encouragement. Each should be a string with 2-3 sentences. Be warm, insightful, and therapeutic in tone.`;

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
      maxTokens: 1000,
      temperature: 0.6,
    });

    // Parse the JSON response
    try {
      const insights = JSON.parse(text);
      return NextResponse.json({ insights });
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return NextResponse.json({
        insights: {
          keyThemes: text.substring(0, 200) + "...",
          progressIndicators:
            "Your consistent journaling shows dedication to self-improvement and growth.",
          patterns:
            "Continue exploring the themes that resonate most with your current experiences.",
          breakthroughs:
            "Each entry represents a step forward in your journey of self-discovery.",
          focusAreas:
            "Keep building on the insights you've gained through regular reflection.",
          encouragement:
            "Your commitment to understanding yourself better is truly commendable.",
        },
      });
    }
  } catch (error) {
    console.error("Insights generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
