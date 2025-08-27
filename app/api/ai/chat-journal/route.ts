import { streamText } from "ai";
import { xai } from "@ai-sdk/xai";
import type { NextRequest } from "next/server";
import {
  createDatabaseService,
  getUserSubscription,
  createSubscription,
  checkQuestionLimit,
  incrementQuestionUsage,
} from "@/lib/database";
import { getTemplateById } from "@/lib/problem-templates";

export async function POST(request: NextRequest) {
  try {
    const { userId, journalId, conversation, isFirstMessage } =
      await request.json();

    if (!userId) {
      return new Response("User ID is required", { status: 400 });
    }

    const db = createDatabaseService();

    const subscription = await getUserSubscription(userId);
    if (!subscription) {
      await createSubscription(userId, "free");
      const newSubscription = await getUserSubscription(userId);
      if (!newSubscription) {
        return new Response("Failed to create subscription", { status: 500 });
      }
    }

    const questionLimit = await checkQuestionLimit(userId);
    if (!questionLimit.canAsk) {
      return new Response(
        JSON.stringify({
          error: "Daily question limit reached",
          message:
            "You've reached your daily question limit. Please upgrade your plan or try again tomorrow.",
          limitReached: true,
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Increment question usage
    await incrementQuestionUsage(userId);

    let journal = null;
    let template = null;

    if (journalId) {
      journal = await db.getJournalById(journalId);
      if (journal) {
        template = getTemplateById(journal.template_id);
      }
    }

    const profile = await db.getUserProfile(userId);
    const recentEntries = journalId
      ? await db.getJournalEntries(journalId, 2)
      : await db.getRecentJournalEntries(userId, 2);

    const systemPrompt =
      template?.aiPromptContext ||
      `You are a warm, empathetic journaling companion having a natural conversation with someone about their day and thoughts. 

Your personality:
- Conversational and friendly, like talking to a close friend
- Ask one thoughtful question at a time
- Show genuine interest and curiosity
- Reference what they've shared to build connection
- Adapt your tone to match their energy level
- Use their name occasionally if available

Guidelines:
- Keep responses to 1-2 sentences maximum
- Ask follow-up questions based on their previous answers
- Be encouraging and supportive
- Help them explore their thoughts and feelings deeper
- End the conversation naturally after 6-8 exchanges`;

    let conversationContext = "";

    if (template) {
      conversationContext += `Journal Focus: ${template.title} - ${template.description}. `;
      conversationContext += `Key areas to explore: ${template.focusAreas.join(
        ", "
      )}. `;
    }

    if (profile) {
      conversationContext += `About the user: ${
        profile.description || "Getting to know them"
      }. `;
      if (profile.interests?.length) {
        conversationContext += `Interests: ${profile.interests.join(", ")}. `;
      }
      if (profile.goals?.length) {
        conversationContext += `Goals: ${profile.goals.join(", ")}. `;
      }
    }

    if (recentEntries.length > 0) {
      conversationContext += `Recent journal themes: ${recentEntries
        .map((entry) => entry.generated_entry?.substring(0, 100) + "...")
        .join(" ")}. `;
    }

    let prompt = "";

    if (isFirstMessage) {
      if (template) {
        prompt = `${conversationContext}

Start a natural journaling conversation focused on ${template.title.toLowerCase()}. Ask an opening question that's specifically relevant to their ${template.title.toLowerCase()} challenges and feels personal.

Consider these focus areas: ${template.focusAreas.join(", ")}.

Examples for ${template.title}:
${
  template.id === "people-pleasing"
    ? `
- "Hi! I'm curious - was there a moment today where you felt torn between what you wanted and what you thought others expected of you?"
- "Hey there! How did you handle any situations today where you had to choose between your needs and someone else's?"`
    : ""
}
${
  template.id === "overthinking"
    ? `
- "Hi! What's been cycling through your mind today? I'm curious about any decisions or situations you've been analyzing."
- "Hey! Did you catch yourself in any worry loops today, or was your mind pretty calm?"`
    : ""
}
${
  template.id === "perfectionism"
    ? `
- "Hi! How did you handle any 'good enough' vs 'perfect' moments today?"
- "Hey there! Were there any tasks or situations today where you had to choose between progress and perfection?"`
    : ""
}

Choose something that feels natural and specific to their ${template.title.toLowerCase()} journey.`;
      } else {
        prompt = `${conversationContext}

Start a natural journaling conversation. Ask an opening question that feels personal and relevant to their life/interests. Make it feel like you're genuinely curious about their day.

Examples of good opening questions:
- "Hey! How was your day? I'm curious what stood out to you most."
- "Hi there! What's been on your mind lately?"
- "How are you feeling right now? I'd love to hear what's going on in your world."

Choose something that fits their profile and feels natural.`;
      }
    } else {
      // Build conversation history
      const conversationHistory = conversation
        .map(
          (msg: any) => `${msg.type === "ai" ? "You" : "User"}: ${msg.content}`
        )
        .join("\n");

      const templateGuidance = template
        ? `
Remember this conversation is focused on ${template.title.toLowerCase()}. Look for opportunities to explore:
${template.focusAreas.map((area) => `- ${area}`).join("\n")}

Ask questions that help them recognize patterns, triggers, and growth opportunities related to ${template.title.toLowerCase()}.`
        : "";

      prompt = `${conversationContext}

Conversation so far:
${conversationHistory}
${templateGuidance}

Based on what they just shared, ask a thoughtful follow-up question that:
1. Shows you were listening to their response
2. Helps them explore their thoughts/feelings deeper${
        template ? ` related to ${template.title.toLowerCase()}` : ""
      }
3. Builds on what they've already shared
4. Feels natural and conversational

If this is the 6th+ exchange, consider wrapping up the conversation naturally by asking a final reflective question or offering encouragement.`;
    }

    const result = streamText({
      model: xai("grok-3", {
        apiKey: process.env.XAI_API_KEY,
      }),
      prompt,
      system: systemPrompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in chat journal:", error);
    return new Response("Failed to generate response", { status: 500 });
  }
}
