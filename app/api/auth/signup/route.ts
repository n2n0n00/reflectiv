import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail, createDatabaseService } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, description } = await request.json()

    if (!email || !password || !name || !description) {
      return NextResponse.json({ error: "Email, password, name, and description are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    const user = await createUser(email, name, password, description)

    const db = createDatabaseService()
    await db.createUserSubscription(user.id, "free")

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
