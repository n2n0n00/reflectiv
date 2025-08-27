"use client";

import { useState, useMemo } from "react";
import { ExportHeader } from "@/components/export/export-header";
import { ExportFilters } from "@/components/export/export-filters";
import { ExportPreview } from "@/components/export/export-preview";
import { ExportOptions } from "@/components/export/export-options";
import { useAuth } from "@/lib/auth-context";

export interface JournalEntry {
  id: string;
  content: string;
  template: string;
  template_color: string | null;
  created_at: string;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface ExportLog {
  id: string;
  user_id?: string;
  format: string;
  created_at: string;
}

export default function ExportPage() {
  const { user } = useAuth();

  const [selectedRange, setSelectedRange] = useState<
    "week" | "month" | "quarter" | "all" | "custom"
  >("month");
  const [customRange, setCustomRange] = useState<{
    start: string | null;
    end: string | null;
  }>({ start: null, end: null });
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [includeInsights, setIncludeInsights] = useState(true);

  const absoluteDateRange: DateRange | null = useMemo(() => {
    if (selectedRange === "all") return null;
    if (selectedRange === "custom" && customRange.start && customRange.end) {
      return {
        start: new Date(customRange.start).toISOString(),
        end: new Date(customRange.end).toISOString(),
      };
    }
    const now = new Date();
    let start: Date | undefined;
    if (selectedRange === "week")
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    if (selectedRange === "month")
      start = new Date(now.setMonth(now.getMonth() - 1));
    if (selectedRange === "quarter")
      start = new Date(now.setMonth(now.getMonth() - 3));
    if (!start) return null;
    return { start: start.toISOString(), end: new Date().toISOString() };
  }, [selectedRange, customRange]);

  return (
    <div className="min-h-screen bg-background">
      <ExportHeader />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ExportFilters
              user={user}
              selectedRange={selectedRange}
              setSelectedRange={setSelectedRange}
              customRange={customRange}
              setCustomRange={setCustomRange}
              selectedTemplates={selectedTemplates}
              setSelectedTemplates={setSelectedTemplates}
              includeInsights={includeInsights}
              setIncludeInsights={setIncludeInsights}
            />

            <ExportPreview
              user={user}
              selectedRange={selectedRange}
              absoluteDateRange={absoluteDateRange}
              selectedTemplates={selectedTemplates}
            />
          </div>

          <div className="space-y-8">
            <ExportOptions
              user={user}
              selectedFormatDefault="pdf"
              selectedTemplates={selectedTemplates}
              absoluteDateRange={absoluteDateRange}
              includeInsights={includeInsights}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
