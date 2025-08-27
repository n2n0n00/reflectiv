import { type NextRequest, NextResponse } from "next/server"
import { createDatabaseService } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const journalId = searchParams.get("journalId") // Added journalId parameter for filtering

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log("[v0] Journal entries API called for user:", userId, "journal:", journalId) // Added logging

    const db = createDatabaseService()

    let entries
    if (journalId) {
      entries = await db.getJournalEntriesByJournal(userId, journalId)
    } else {
      entries = await db.getJournalEntries(userId, 50) // Get last 50 entries
    }

    console.log("[v0] Found", entries.length, "entries") // Added logging for entry count

    return NextResponse.json({ entries })
  } catch (error) {
    console.error("Error fetching journal entries:", error)
    return NextResponse.json({ error: "Failed to fetch journal entries" }, { status: 500 })
  }
}
