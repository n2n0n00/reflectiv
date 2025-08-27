import { type NextRequest, NextResponse } from "next/server"
import { createDatabaseService } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const journalId = searchParams.get("journalId") // Added journalId parameter for filtering
    const format = searchParams.get("format") || "pdf" // pdf or json

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const db = createDatabaseService()

    let entries
    if (journalId) {
      entries = await db.getJournalEntries(journalId)
    } else {
      entries = await db.getAllJournalEntries(userId)
    }

    if (!entries || entries.length === 0) {
      return NextResponse.json({ error: "No journal entries found" }, { status: 404 })
    }

    // Sort entries by date (newest first)
    const sortedEntries = entries.sort((a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime())

    if (format === "json") {
      return NextResponse.json({
        entries: sortedEntries.map((entry) => ({
          date: entry.entry_date,
          content: entry.generated_entry || entry.ai_generated_entry,
          questions: entry.questions,
          answers: entry.answers,
          journal_title: entry.journal_title, // Include journal title for multi-journal downloads
          template_id: entry.template_id, // Include template info
        })),
      })
    }

    return NextResponse.json({ error: "Invalid format" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching journal entries:", error)
    return NextResponse.json({ error: "Failed to fetch journal entries" }, { status: 500 })
  }
}
