// api/insights/progress/route.ts
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
    const timeRange = (searchParams.get("timeRange") || "month") as
      | "week"
      | "month"
      | "quarter"
      | "all";

    const progressData = await InsightsService.getProgressMetrics(
      user.id,
      timeRange
    );

    return NextResponse.json({
      success: true,
      data: progressData,
    });
  } catch (error) {
    console.error("Progress metrics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress metrics" },
      { status: 500 }
    );
  }
}
