"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { JournalEntry } from "@/app/export/page";

export function ExportPreview({
  user,
  selectedRange,
  absoluteDateRange,
  selectedTemplates,
}: any) {
  const supabase = useMemo(() => createClient(), []);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      if (!user) return;
      setLoading(true);
      let query = supabase
        .from("journal_entries")
        .select("id, content, template, template_color, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (selectedTemplates?.length)
        query = query.in("template", selectedTemplates);
      if (absoluteDateRange?.start && absoluteDateRange?.end) {
        query = query
          .gte("created_at", absoluteDateRange.start)
          .lte("created_at", absoluteDateRange.end);
      }

      const { data, error } = await query;
      if (!error && data) setEntries(data);
      setLoading(false);
    };

    fetchEntries();
  }, [
    user?.id,
    JSON.stringify(selectedTemplates),
    JSON.stringify(absoluteDateRange),
  ]);

  const totalWords = useMemo(() => {
    return entries.reduce(
      (sum: any, e: any) => sum + (e.content?.split(/\s+/).length || 0),
      0
    );
  }, [entries]);

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="w-5 h-5 text-primary" />
          <span className="font-serif">Export Preview</span>
          <Badge variant="secondary" className="text-xs">
            {entries.length} entries
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading entries…</div>
        ) : entries.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No entries match the current filters.
          </div>
        ) : (
          <>
            <div className="text-sm text-muted-foreground mb-4">
              Preview of entries that will be included in your export:
            </div>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {entries.map((entry: any) => (
                <div
                  key={entry.id}
                  className="border border-border rounded-lg p-4 bg-muted/30"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {entry.template}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {entry.content?.split(/\s+/).length || 0} words
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {entry.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-primary/10 rounded-lg p-4 text-center">
              <p className="text-sm text-foreground">
                <strong>Total:</strong> {entries.length} entries • {totalWords}{" "}
                words
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
