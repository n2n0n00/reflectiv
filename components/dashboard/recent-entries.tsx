"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  extractPreview,
  extractTitle,
  getColorClass,
  ProcessedEntry,
} from "@/lib/utils";
import supabase from "@/lib/supabase/ssrUpdatedClient";

export function RecentEntries() {
  const [entries, setEntries] = useState<ProcessedEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecentEntries() {
      try {
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw new Error("Failed to get user");
        }

        if (!user) {
          throw new Error("User not authenticated");
        }

        // Fetch recent journal entries with journal information
        const { data, error: fetchError } = await supabase
          .from("journal_entries")
          .select(
            `
            id,
            journal_id,
            user_id,
            content,
            template,
            template_color,
            created_at,
            updated_at,
            is_exported,
            export_count,
            journals (
              template_name,
              template_color
            )
          `
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3);

        if (fetchError) {
          throw new Error(`Failed to fetch entries: ${fetchError.message}`);
        }

        if (!data || data.length === 0) {
          setEntries([]);
          return;
        }

        // Process the data to match the component's expected format
        const processedEntries: ProcessedEntry[] = data.map((entry: any) => ({
          id: entry.id,
          date: entry.created_at,
          template: entry.journals?.template_name || entry.template,
          title: extractTitle(entry.content),
          preview: extractPreview(entry.content),
          color: entry.journals?.template_color || entry.template_color,
        }));

        setEntries(processedEntries);
      } catch (err) {
        console.error("Error fetching recent entries:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchRecentEntries();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-foreground">
            Recent Entries
          </h2>
          <div className="w-32 h-10 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border bg-card">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-muted rounded-full"></div>
                    <div className="w-20 h-4 bg-muted rounded"></div>
                    <div className="w-16 h-4 bg-muted rounded"></div>
                  </div>
                  <div className="w-3/4 h-5 bg-muted rounded"></div>
                  <div className="w-full h-4 bg-muted rounded"></div>
                  <div className="w-2/3 h-4 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-foreground">
            Recent Entries
          </h2>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-700">Error loading entries: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-foreground">
            Recent Entries
          </h2>
          <Link href="/entries">
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-muted bg-transparent"
            >
              View All Entries
            </Button>
          </Link>
        </div>
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <p className="text-muted-foreground text-center">
              No journal entries found. Start writing your first entry!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-foreground">
          Recent Entries
        </h2>
        <Link href="/entries">
          <Button
            variant="outline"
            className="border-border text-foreground hover:bg-muted bg-transparent"
          >
            View All Entries
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {entries.map((entry) => (
          <Card
            key={entry.id}
            className="border-border bg-card hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between space-x-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 ${entry.color} rounded-full`}
                    ></div>
                    <Badge variant="secondary" className="text-xs">
                      {entry.template}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-semibold text-foreground mb-2">
                      {entry.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {entry.preview}
                    </p>
                  </div>
                </div>

                <Link href={`/entry/${entry.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Read More
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
