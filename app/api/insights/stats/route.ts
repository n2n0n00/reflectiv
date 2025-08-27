// api/insights/stats/route.ts
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

    const stats = await InsightsService.getJournalStats(user.id);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Journal stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch journal stats" },
      { status: 500 }
    );
  }
}
