"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import supabase from "@/lib/supabase/ssrUpdatedClient";

interface JournalWithStats {
  id: string;
  template_id: string;
  template_name: string;
  template_color: string;
  user_context: string | null;
  start_date: string;
  is_complete: boolean;
  entries_count: number;
  last_entry_date: string | null;
  progress: number;
}

export function JournalOverview() {
  const [journals, setJournals] = useState<JournalWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateProgress = (entriesCount: number): number => {
    const maxEntries = 900;
    return Math.min((entriesCount / maxEntries) * 100, 100);
  };

  const fetchActiveJournals = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No authenticated user found");
      }

      const { data: journalsData, error: journalsError } = await supabase
        .from("journals")
        .select(
          `
          id,
          template_id,
          template_name,
          template_color,
          user_context,
          start_date,
          is_complete
        `
        )
        .eq("user_id", user.id)
        .eq("is_complete", false)
        .order("start_date", { ascending: false });

      if (journalsError) {
        throw new Error("Failed to fetch journals: " + journalsError.message);
      }

      if (!journalsData || journalsData.length === 0) {
        setJournals([]);
        return;
      }

      const journalsWithStats = await Promise.all(
        journalsData.map(async (journal) => {
          const { data: entriesData, error: entriesError } = await supabase
            .from("journal_entries")
            .select("created_at")
            .eq("journal_id", journal.id)
            .order("created_at", { ascending: false });

          if (entriesError) {
            console.error(
              "Failed to fetch entries for journal:",
              journal.id,
              entriesError
            );
            return {
              ...journal,
              entries_count: 0,
              last_entry_date: null,
              progress: 0,
            };
          }

          const entriesCount = entriesData?.length || 0;
          const lastEntryDate =
            entriesData && entriesData.length > 0
              ? entriesData[0].created_at
              : null;
          const progress = calculateProgress(entriesCount);

          return {
            ...journal,
            entries_count: entriesCount,
            last_entry_date: lastEntryDate,
            progress: Math.round(progress),
          };
        })
      );

      setJournals(journalsWithStats);
    } catch (err) {
      console.error("Error fetching journals:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching journals"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveJournals();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-foreground">
            Your Active Journals
          </h2>
          <Button
            variant="outline"
            className="border-border text-foreground hover:bg-muted bg-transparent"
            disabled
          >
            Start New Journal
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="border-border bg-card animate-pulse">
              <CardHeader className="space-y-4">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-2 bg-muted rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-1/3"></div>
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
            Your Active Journals
          </h2>
          <Link href="/templates">
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-muted bg-transparent"
            >
              Start New Journal
            </Button>
          </Link>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Error loading journals: {error}</p>
            <Button
              onClick={fetchActiveJournals}
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (journals.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-foreground">
            Your Active Journals
          </h2>
          <Link href="/templates">
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-muted bg-transparent"
            >
              Start New Journal
            </Button>
          </Link>
        </div>
        <Card className="border-border bg-card">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">
              You don't have any active journals yet.
            </p>
            <Link href="/templates">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Start Your First Journal
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-foreground">
          Your Active Journals
        </h2>
        <Link href="/templates">
          <Button
            variant="outline"
            className="border-border text-foreground hover:bg-muted bg-transparent"
          >
            Start New Journal
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {journals.map((journal) => (
          <Card
            key={journal.id}
            className="border-border bg-card hover:shadow-lg transition-shadow"
          >
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-4 h-4 ${journal.template_color} rounded-full`}
                  ></div>
                  <CardTitle className="text-lg font-serif text-foreground">
                    {journal.template_name}
                  </CardTitle>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {journal.entries_count} entries
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progress</span>
                  <span>{journal.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`${
                      journal.progress > 0
                        ? journal.template_color
                        : "bg-gray-300"
                    } h-2 rounded-full transition-all duration-300`}
                    style={{
                      width:
                        journal.progress > 0 ? `${journal.progress}%` : "100%",
                      opacity: journal.progress > 0 ? 1 : 0.5,
                    }}
                  ></div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>
                  Started: {new Date(journal.start_date).toLocaleDateString()}
                </p>
                {journal.last_entry_date && (
                  <p>
                    Last entry:{" "}
                    {new Date(journal.last_entry_date).toLocaleDateString()}
                  </p>
                )}
                {!journal.last_entry_date && <p>No entries yet</p>}
              </div>

              <div className="flex space-x-2">
                <Link
                  href={`/journal/session/${journal.template_id}/${journal.id}`}
                  className="flex-1"
                >
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    {journal.entries_count > 0
                      ? "Continue Journaling"
                      : "Start Journaling"}
                  </Button>
                </Link>
                <Link href={`/insights/${journal.id}`}>
                  <Button
                    variant="outline"
                    className="border-border text-foreground hover:bg-muted bg-transparent"
                    disabled={journal.entries_count === 0}
                  >
                    View Insights
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
