import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Mock billing history data
    const billingHistory = [
      {
        id: "inv_001",
        date: "2024-01-01",
        amount: 15.0,
        status: "paid",
        plan: "Mindful Explorer",
        period: "Jan 1 - Feb 1, 2024",
        downloadUrl: "/api/billing/invoice/inv_001",
      },
      {
        id: "inv_002",
        date: "2023-12-01",
        amount: 15.0,
        status: "paid",
        plan: "Mindful Explorer",
        period: "Dec 1 - Jan 1, 2024",
        downloadUrl: "/api/billing/invoice/inv_002",
      },
      {
        id: "inv_003",
        date: "2023-11-01",
        amount: 0.0,
        status: "paid",
        plan: "Free Trial",
        period: "Nov 1 - Dec 1, 2023",
        downloadUrl: null,
      },
    ]

    return NextResponse.json(billingHistory)
  } catch (error) {
    console.error("Billing history fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch billing history" }, { status: 500 })
  }
}
