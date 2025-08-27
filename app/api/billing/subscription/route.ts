import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Mock current subscription data
    const subscription = {
      id: "sub_123",
      plan: "Mindful Explorer",
      price: 15,
      status: "active",
      currentPeriodStart: "2024-01-01",
      currentPeriodEnd: "2024-02-01",
      cancelAtPeriodEnd: false,
      trialEnd: null,
      usage: {
        journalEntries: 45,
        aiInsights: 12,
        exports: 3,
        limits: {
          journalEntries: 100,
          aiInsights: 20,
          exports: 10,
        },
      },
    }

    return NextResponse.json(subscription)
  } catch (error) {
    console.error("Subscription fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, planId } = await request.json()

    switch (action) {
      case "upgrade":
        // Mock plan upgrade
        return NextResponse.json({
          success: true,
          message: `Successfully upgraded to ${planId}`,
          redirectUrl: "/billing?success=upgrade",
        })

      case "cancel":
        // Mock subscription cancellation
        return NextResponse.json({
          success: true,
          message: "Subscription will be cancelled at the end of the current period",
          cancelAtPeriodEnd: true,
        })

      case "reactivate":
        // Mock subscription reactivation
        return NextResponse.json({
          success: true,
          message: "Subscription reactivated successfully",
          cancelAtPeriodEnd: false,
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Subscription update error:", error)
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
  }
}
