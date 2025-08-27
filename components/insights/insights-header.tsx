import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, TrendingUp } from "lucide-react";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
} from "react";
import { getWeekRange } from "@/lib/extraUtils";

export function InsightsHeader() {
  const date = getWeekRange();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center flex-col justify-center md:flex-row md:gap-3">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="font-serif font-semibold text-foreground text-lg lg:text-xl">
              Weekly Insights
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="text-xs hidden md:flex">
            <Calendar className="w-3 h-3 mr-1" />
            {date}
          </Badge>
          {/* <Link href="/insights/export">
            <Button
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-muted bg-transparent"
            >
              Export Report
            </Button>
          </Link> */}
        </div>
      </div>
    </header>
  );
}
