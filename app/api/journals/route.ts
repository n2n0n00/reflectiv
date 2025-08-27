import { type NextRequest, NextResponse } from "next/server"
import { createJournal, getUserJournals } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { userId, templateId, title, description } = await request.json()

    if (!userId || !templateId || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const journal = await createJournal(userId, templateId, title, description)

    return NextResponse.json(journal)
  } catch (error) {
    console.error("Error creating journal:", error)
    return NextResponse.json({ error: "Failed to create journal" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const journals = await getUserJournals(userId)

    return NextResponse.json({ journals })
  } catch (error) {
    console.error("Error fetching journals:", error)
    return NextResponse.json({ error: "Failed to fetch journals" }, { status: 500 })
  }
}
