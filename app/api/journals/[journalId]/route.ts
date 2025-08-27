import { type NextRequest, NextResponse } from "next/server"
import { getJournalById } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { journalId: string } }) {
  try {
    const journal = await getJournalById(params.journalId)

    if (!journal) {
      return NextResponse.json({ error: "Journal not found" }, { status: 404 })
    }

    return NextResponse.json(journal)
  } catch (error) {
    console.error("Error fetching journal:", error)
    return NextResponse.json({ error: "Failed to fetch journal" }, { status: 500 })
  }
}
