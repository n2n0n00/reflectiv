import { type NextRequest, NextResponse } from "next/server"
import { createDatabaseService } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const db = createDatabaseService()
    const subscription = await db.getUserSubscription(userId)

    return NextResponse.json(subscription)
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, planType } = await request.json()

    if (!userId || !planType) {
      return NextResponse.json({ error: "User ID and plan type are required" }, { status: 400 })
    }

    const db = createDatabaseService()

    // Start 7-day free trial for new subscriptions
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 7)

    const subscription = await db.createSubscription(userId, planType, trialEndsAt)

    return NextResponse.json(subscription)
  } catch (error) {
    console.error("Error creating subscription:", error)
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, planType, action } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const db = createDatabaseService()

    if (action === "cancel") {
      await db.cancelSubscription(userId)
      return NextResponse.json({ message: "Subscription cancelled" })
    } else if (action === "upgrade" && planType) {
      const subscription = await db.updateSubscription(userId, planType)
      return NextResponse.json(subscription)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error updating subscription:", error)
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
  }
}
