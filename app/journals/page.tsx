"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Calendar, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface JournalEntry {
  id: string;
  created_at: string;
  title: string;
  content: string;
  template_name: string;
  mood: string;
  word_count: number;
  insights_count: number;
}

export default function JournalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("all");
  const [selectedMood, setSelectedMood] = useState("all");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuthAndFetchEntries() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          console.log("[v0] User not authenticated, redirecting to login");
          router.push("/login");
          return;
        }

        const { data: entriesData, error: entriesError } = await supabase
          .from("journal_entries")
          .select(
            `
            id,
            created_at,
            title,
            content,
            template_name,
            mood,
            word_count,
            insights_count
          `
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (entriesError) {
          console.error("[v0] Error fetching entries:", entriesError);
          setError("Failed to load journal entries");
          return;
        }

        setEntries(entriesData || []);
      } catch (err) {
        console.error("[v0] Unexpected error:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    checkAuthAndFetchEntries();
  }, [supabase, router]);

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTemplate =
      selectedTemplate === "all" || entry.template_name === selectedTemplate;
    const matchesMood = selectedMood === "all" || entry.mood === selectedMood;

    return matchesSearch && matchesTemplate && matchesMood;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">
            Loading your journal entries...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center border-border bg-card max-w-md">
          <div className="space-y-4">
            <div className="text-red-500 text-lg font-semibold">Error</div>
            <p className="text-muted-foreground">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-serif font-bold text-foreground">
              Your Journal Entries
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore your therapeutic journey through all your journal entries
              and insights.
            </p>
          </div>

          {/* Filters */}
          <Card className="p-6 border-border bg-card">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-foreground">
                <Filter className="w-4 h-4" />
                <h3 className="font-medium">Filter & Search</h3>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-input border-border focus:ring-ring"
                  />
                </div>

                <Select
                  value={selectedTemplate}
                  onValueChange={setSelectedTemplate}
                >
                  <SelectTrigger className="bg-input border-border focus:ring-ring">
                    <SelectValue placeholder="All Templates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Templates</SelectItem>
                    <SelectItem value="People Pleasing">
                      People Pleasing
                    </SelectItem>
                    <SelectItem value="Overthinking">Overthinking</SelectItem>
                    <SelectItem value="Perfectionism">Perfectionism</SelectItem>
                    <SelectItem value="Anxiety Management">
                      Anxiety Management
                    </SelectItem>
                    <SelectItem value="Self-Compassion">
                      Self-Compassion
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedMood} onValueChange={setSelectedMood}>
                  <SelectTrigger className="bg-input border-border focus:ring-ring">
                    <SelectValue placeholder="All Moods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Moods</SelectItem>
                    <SelectItem value="Empowered">Empowered</SelectItem>
                    <SelectItem value="Reflective">Reflective</SelectItem>
                    <SelectItem value="Confident">Confident</SelectItem>
                    <SelectItem value="Proud">Proud</SelectItem>
                    <SelectItem value="Calm">Calm</SelectItem>
                    <SelectItem value="Hopeful">Hopeful</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 border-border bg-card text-center">
              <div className="space-y-2">
                <BookOpen className="w-8 h-8 text-primary mx-auto" />
                <div className="text-2xl font-bold text-foreground">
                  {entries.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Entries
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border bg-card text-center">
              <div className="space-y-2">
                <Calendar className="w-8 h-8 text-primary mx-auto" />
                <div className="text-2xl font-bold text-foreground">
                  {
                    new Set(
                      entries.map((e) => new Date(e.created_at).toDateString())
                    ).size
                  }
                </div>
                <div className="text-sm text-muted-foreground">
                  Days Journaled
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border bg-card text-center">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary-foreground text-sm font-bold">
                    AI
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {entries.reduce(
                    (sum, entry) => sum + (entry.insights_count || 0),
                    0
                  )}
                </div>
                <div className="text-sm text-muted-foreground">AI Insights</div>
              </div>
            </Card>
          </div>

          {/* Entries */}
          <div className="space-y-6">
            {filteredEntries.length === 0 ? (
              <Card className="p-12 text-center border-border bg-card">
                <div className="space-y-4">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-serif font-semibold text-foreground">
                    {entries.length === 0
                      ? "No journal entries yet"
                      : "No entries found"}
                  </h3>
                  <p className="text-muted-foreground">
                    {entries.length === 0
                      ? "Start your therapeutic journey by creating your first journal entry."
                      : "Try adjusting your filters or search terms."}
                  </p>
                  {entries.length === 0 && (
                    <Link href="/templates">
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Start Your First Entry
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            ) : (
              filteredEntries.map((entry) => (
                <Card
                  key={entry.id}
                  className="border-border bg-card hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between space-x-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          <Badge variant="secondary" className="text-xs">
                            {entry.template_name || "General"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(entry.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                            {entry.title || "Untitled Entry"}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed line-clamp-3">
                            {entry.content?.substring(0, 200)}...
                          </p>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          {entry.mood && (
                            <div className="flex items-center space-x-1">
                              <Badge variant="outline" className="text-xs">
                                Mood: {entry.mood}
                              </Badge>
                            </div>
                          )}
                          <span>{entry.word_count || 0} words</span>
                          <span>{entry.insights_count || 0} insights</span>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Link href={`/entry/${entry.id}`}>
                          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            Read Entry
                          </Button>
                        </Link>
                        <Link href={`/journal/session/${entry.id}`}>
                          <Button
                            variant="outline"
                            className="border-border text-foreground hover:bg-muted bg-transparent"
                          >
                            Continue Session
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Call to Action */}
          <Card className="p-8 text-center border-primary bg-card">
            <div className="space-y-4">
              <h3 className="text-xl font-serif font-semibold text-foreground">
                Ready for your next session?
              </h3>
              <p className="text-muted-foreground">
                Continue your therapeutic journey with AI-guided journaling.
              </p>
              <Link href="/templates">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Start New Journal Session
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
