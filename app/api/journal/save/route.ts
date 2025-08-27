import type { NextRequest } from "next/server"
import { createDatabaseService } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { userId, journalId, questions, answers, aiGeneratedEntry } = await request.json()

    if (!userId || !journalId || !questions || !answers || !aiGeneratedEntry) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = createDatabaseService()
    const savedEntry = await db.saveJournalEntry(userId, journalId, {
      questions,
      answers,
      aiGeneratedEntry,
    })

    return Response.json({ success: true, entry: savedEntry })
  } catch (error) {
    console.error("Error saving journal entry:", error)
    return Response.json({ error: "Failed to save journal entry" }, { status: 500 })
  }
}
