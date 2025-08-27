// api/insights/patterns/route.ts
import { NextRequest, NextResponse } from "next/server";
import { InsightsService } from "@/lib/supabase/insights";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeRange = (searchParams.get("timeRange") || "week") as
      | "week"
      | "month"
      | "quarter"
      | "all";

    const patterns = await InsightsService.analyzePatterns(user.id, timeRange);

    return NextResponse.json({
      success: true,
      data: patterns,
    });
  } catch (error) {
    console.error("Pattern analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze patterns" },
      { status: 500 }
    );
  }
}
