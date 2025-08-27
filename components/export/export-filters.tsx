"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Filter, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const dateRanges = [
  { label: "Last 7 Days", value: "week" },
  { label: "Last 30 Days", value: "month" },
  { label: "Last 3 Months", value: "quarter" },
  { label: "All Time", value: "all" },
  { label: "Custom Range", value: "custom" },
];

export function ExportFilters({
  user,
  selectedRange,
  setSelectedRange,
  customRange,
  setCustomRange,
  selectedTemplates,
  setSelectedTemplates,
  includeInsights,
  setIncludeInsights,
}: any) {
  const supabase = useMemo(() => createClient(), []);
  const [availableTemplates, setAvailableTemplates] = useState<
    { value: string; label: string; color: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Load distinct templates (and counts) for this user
  useEffect(() => {
    const loadTemplates = async () => {
      if (!user) return;
      setLoading(true);
      // Fetch entries and aggregate on client (simpler + works under RLS)
      const { data, error } = await supabase
        .from("journal_entries")
        .select("template, template_color")
        .eq("user_id", user.id);

      if (!error && data) {
        const map = new Map();
        for (const row of data) {
          const key = row.template;
          const current = map.get(key) || {
            value: row.template,
            label: row.template,
            color: row.template_color,
            count: 0,
          };
          current.count += 1;
          current.color = row.template_color || current.color;
          map.set(key, current);
        }
        const list = Array.from(map.values()).sort((a, b) => b.count - a.count);
        setAvailableTemplates(list);
        // Preselect top 2 if nothing chosen yet
        if (selectedTemplates.length === 0 && list.length > 0) {
          setSelectedTemplates(list.slice(0, 2).map((t) => t.value));
        }
      }
      setLoading(false);
    };
    loadTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const totalEntries = useMemo(() => {
    return availableTemplates
      .filter((t: any) => selectedTemplates.includes(t.value))
      .reduce((sum: any, t: any) => sum + t.count, 0);
  }, [availableTemplates, selectedTemplates]);

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-primary" />
          <span className="font-serif">Export Filters</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Range */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Date Range
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {dateRanges.map((range) => (
              <Button
                key={range.value}
                variant={selectedRange === range.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRange(range.value)}
                className={
                  selectedRange === range.value
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                    : "border-border text-foreground hover:bg-muted bg-transparent"
                }
              >
                {range.label}
              </Button>
            ))}
          </div>

          {selectedRange === "custom" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="rounded border px-2 py-1 bg-background border-border text-sm"
                value={customRange.start || ""}
                onChange={(e) =>
                  setCustomRange({ ...customRange, start: e.target.value })
                }
              />
              <span className="text-sm text-muted-foreground">to</span>
              <input
                type="date"
                className="rounded border px-2 py-1 bg-background border-border text-sm"
                value={customRange.end || ""}
                onChange={(e) =>
                  setCustomRange({ ...customRange, end: e.target.value })
                }
              />
            </div>
          )}
        </div>

        {/* Templates */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Journal Templates
            </span>
          </div>
          {loading ? (
            <div className="text-sm text-muted-foreground">
              Loading templates…
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {availableTemplates.map((template: any) => (
                <div
                  key={template.value}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedTemplates.includes(template.value)
                      ? "border-primary bg-primary/5"
                      : "border-border bg-transparent hover:bg-muted"
                  }`}
                  onClick={() =>
                    setSelectedTemplates((prev: any) =>
                      prev.includes(template.value)
                        ? prev.filter((t: any) => t !== template.value)
                        : [...prev, template.value]
                    )
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: template.color }}
                      />
                      <span className="text-sm font-medium text-foreground">
                        {template.label}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {template.count}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Options */}
        {/* <div className="space-y-3">
          <span className="text-sm font-medium text-foreground">Include</span>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeInsights}
                onChange={(e) => setIncludeInsights(e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm text-foreground">
                Weekly insights and analysis
              </span>
            </label>
          </div>
        </div> */}

        {/* Summary */}
        <div className="bg-muted rounded-lg p-4">
          <div className="text-sm text-foreground">
            <strong>Export Summary:</strong> {totalEntries} entries from{" "}
            {selectedTemplates.length} templates
            {includeInsights && " + insights"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
