import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { entries, timeframe, templates } = await request.json();

    if (!entries || entries.length === 0) {
      return NextResponse.json({
        insights: {
          keyThemes:
            "No entries available for analysis yet. Start journaling to unlock personalized insights!",
          progressIndicators:
            "Your journey begins with your first entry. Each reflection is a step toward greater self-awareness.",
          patterns:
            "Patterns will emerge as you continue journaling. Consistency is key to discovering your unique insights.",
          breakthroughs:
            "Every entry is a breakthrough moment - a pause for self-reflection in your busy life.",
          focusAreas:
            "Focus on building a consistent journaling habit. Regular reflection will unlock deeper insights over time.",
          encouragement:
            "You're taking the first step toward greater self-understanding. Your commitment to growth is admirable.",
        },
      });
    }

    const entriesText = entries
      .map(
        (entry: any) =>
          `Date: ${entry.date}\nTemplate: ${entry.template}\nEntry: ${entry.content}`
      )
      .join("\n\n---\n\n");

    const timeframeLabel =
      {
        week: "this week",
        month: "this month",
        quarter: "the past quarter",
        all: "your entire journaling journey",
      }[timeframe] || "this period";

    const prompt = `You are a compassionate AI therapist analyzing journal entries to provide insightful summaries and pattern recognition.

Time period: ${timeframeLabel}
Journal templates analyzed: ${templates.join(", ")}

Journal entries:
${entriesText}

Analyze these journal entries and provide insights in the following areas. Be warm, encouraging, and therapeutically insightful:

1. **Key Themes**: What are the main emotional and psychological themes that emerged ${timeframeLabel}? Focus on underlying patterns rather than surface events.

2. **Progress Indicators**: What signs of growth, self-awareness, or positive change can you identify? Look for evidence of developing coping strategies, increased insight, or emotional growth.

3. **Patterns & Triggers**: What recurring patterns, emotional triggers, or situations appear across multiple entries? Help identify what consistently affects their emotional state.

4. **Breakthrough Moments**: Highlight any significant insights, realizations, or emotional breakthroughs. What moments show particular growth or self-awareness?

5. **Areas for Continued Focus**: What areas would benefit from continued exploration and attention? Be specific but supportive.

6. **Encouragement & Validation**: Provide supportive observations about their journey and efforts. Acknowledge their commitment to self-growth.

IMPORTANT: Respond with ONLY a valid JSON object in exactly this format, with no additional text, no markdown formatting, no code blocks:

{
  "keyThemes": "your analysis here in 2-3 sentences",
  "progressIndicators": "your analysis here in 2-3 sentences", 
  "patterns": "your analysis here in 2-3 sentences",
  "breakthroughs": "your analysis here in 2-3 sentences",
  "focusAreas": "your analysis here in 2-3 sentences",
  "encouragement": "your analysis here in 2-3 sentences"
}

Remember: Be therapeutic, warm, and insightful. Focus on growth and self-compassion.`;

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
      maxTokens: 1000,
      temperature: 0.6,
    });

    // Clean the response to extract JSON
    let cleanedText = text.trim();

    // Remove markdown code blocks if present
    cleanedText = cleanedText
      .replace(/```json\s*/g, "")
      .replace(/```\s*$/g, "");

    // Remove any leading/trailing non-JSON content
    const jsonStart = cleanedText.indexOf("{");
    const jsonEnd = cleanedText.lastIndexOf("}");

    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleanedText = cleanedText.substring(jsonStart, jsonEnd + 1);
    }

    // Try to parse the JSON response
    try {
      const insights = JSON.parse(cleanedText);

      // Validate that we have all required fields
      const requiredFields = [
        "keyThemes",
        "progressIndicators",
        "patterns",
        "breakthroughs",
        "focusAreas",
        "encouragement",
      ];
      const hasAllFields = requiredFields.every(
        (field) =>
          insights[field] &&
          typeof insights[field] === "string" &&
          insights[field].trim().length > 0
      );

      if (!hasAllFields) {
        throw new Error("Missing required fields in AI response");
      }

      return NextResponse.json({ insights });
    } catch (parseError) {
      console.error("JSON parsing failed:", parseError);
      console.error("Raw AI response:", text);
      console.error("Cleaned text:", cleanedText);

      // Generate fallback insights based on entry analysis
      const fallbackInsights = generateFallbackInsights(
        entries,
        timeframeLabel,
        templates
      );
      return NextResponse.json({ insights: fallbackInsights });
    }
  } catch (error) {
    console.error("Insights generation error:", error);

    // Return error-specific fallback
    return NextResponse.json({
      insights: {
        keyThemes:
          "Unable to generate detailed themes at this time. Your journaling shows commitment to self-reflection and personal growth.",
        progressIndicators:
          "Your consistent journaling practice demonstrates dedication to understanding yourself better. This consistency is itself a significant indicator of progress.",
        patterns:
          "While detailed pattern analysis isn't available right now, your regular journaling habit shows you're building awareness of your thoughts and emotions.",
        breakthroughs:
          "Every journal entry represents a moment of pause and self-reflection. Your willingness to examine your thoughts and feelings is a breakthrough in itself.",
        focusAreas:
          "Continue building your journaling habit. Regular self-reflection, even when insights aren't immediately clear, builds emotional intelligence over time.",
        encouragement:
          "Your commitment to journaling shows remarkable self-awareness and dedication to personal growth. This practice will serve you well on your journey of self-discovery.",
      },
    });
  }
}

// Helper function to generate contextual fallback insights
function generateFallbackInsights(
  entries: any[],
  timeframe: string,
  templates: string[]
) {
  const entryCount = entries.length;
  const totalWords = entries.reduce(
    (sum: number, entry: any) =>
      sum +
      (entry.content?.split(/\s+/).filter((w: string) => w.length > 0).length ||
        0),
    0
  );
  const avgWords = Math.round(totalWords / entryCount);

  const templateText =
    templates.length > 0
      ? `Your focus on ${templates.join(
          " and "
        )} templates suggests you're working on specific areas of growth.`
      : "Your varied approach to journaling shows openness to exploring different aspects of your inner world.";

  return {
    keyThemes: `Based on your ${entryCount} entries ${timeframe}, you've been engaging in meaningful self-reflection. ${templateText} The themes emerging center around personal growth and emotional awareness.`,
    progressIndicators: `Writing ${totalWords} words across ${entryCount} entries shows remarkable commitment to self-understanding. Your average of ${avgWords} words per entry indicates thoughtful, intentional reflection.`,
    patterns: `Your consistent engagement with journaling ${timeframe} reveals a pattern of prioritizing mental health and self-care. The variety in your entries suggests you're exploring different aspects of your emotional landscape.`,
    breakthroughs: `Each of your ${entryCount} entries represents a moment of breakthrough - choosing to pause, reflect, and engage with your inner world rather than rushing through life on autopilot.`,
    focusAreas: `Continue building on your current momentum. Your ${entryCount} entries ${timeframe} show you're developing a valuable habit of self-reflection that will serve you well in understanding patterns and triggers.`,
    encouragement: `Your dedication to writing ${totalWords} words of self-reflection ${timeframe} is truly commendable. This level of commitment to self-understanding demonstrates wisdom and emotional maturity. Keep nurturing this valuable practice.`,
  };
}
