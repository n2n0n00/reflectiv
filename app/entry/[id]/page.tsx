"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  Edit3,
  Calendar,
  Clock,
  Target,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import supabase from "@/lib/supabase/ssrUpdatedClient";
import {
  countWords,
  estimateAiQuestions,
  estimateSessionDuration,
  extractInsights,
  extractTitle,
  getColorClass,
  ProcessedEntry,
} from "@/lib/extraUtils";

export default function EntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [entry, setEntry] = useState<ProcessedEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function fetchEntry() {
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

        // Fetch the specific journal entry with journal information
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
              id,
              template_name,
              template_color,
              user_context
            )
          `
          )
          .eq("id", resolvedParams.id)
          .eq("user_id", user.id)
          .single();

        if (fetchError) {
          if (fetchError.code === "PGRST116") {
            throw new Error("Entry not found");
          }
          throw new Error(`Failed to fetch entry: ${fetchError.message}`);
        }

        if (!data) {
          throw new Error("Entry not found");
        }

        // Process the data
        const wordCount = countWords(data.content);
        const journal =
          data.journals && data.journals.length > 0 ? data.journals[0] : null;

        const processedEntry: ProcessedEntry = {
          id: data.id,
          date: data.created_at,
          template: journal?.template_name || data.template,
          title: extractTitle(data.content),
          content: data.content,
          color: getColorClass(journal?.template_color || data.template_color),
          wordCount,
          insights: extractInsights(data.content),
          sessionDuration: estimateSessionDuration(wordCount),
          aiQuestions: estimateAiQuestions(wordCount),
          journal_id: data.journal_id,
          is_exported: data.is_exported,
          export_count: data.export_count,
        };

        setEntry(processedEntry);
      } catch (err) {
        console.error("Error fetching entry:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchEntry();
  }, [resolvedParams.id]);

  const handleExport = async () => {
    if (!entry) return;

    setExporting(true);
    try {
      // Create exportable content
      const exportContent = `
# ${entry.title}

**Date:** ${new Date(entry.date).toLocaleDateString()}
**Template:** ${entry.template}
**Word Count:** ${entry.wordCount}
**Session Duration:** ${entry.sessionDuration}

## Content

${entry.content}

## Key Insights

${entry.insights.map((insight, index) => `${index + 1}. ${insight}`).join("\n")}

---
Exported from Journal App
      `.trim();

      // Create and download the file
      const blob = new Blob([exportContent], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `journal-entry-${entry.date.split("T")[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Update export count in database
      await supabase
        .from("journal_entries")
        .update({
          export_count: entry.export_count + 1,
          is_exported: true,
        })
        .eq("id", entry.id);

      // Update local state
      setEntry((prev) =>
        prev
          ? {
              ...prev,
              export_count: prev.export_count + 1,
              is_exported: true,
            }
          : null
      );
    } catch (error) {
      console.error("Error exporting entry:", error);
      alert("Failed to export entry. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-muted-foreground">Loading entry...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            <Link href="/entries">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Entries
              </Button>
            </Link>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-8 text-center">
                <h2 className="text-xl font-semibold text-red-800 mb-2">
                  {error === "Entry not found"
                    ? "Entry Not Found"
                    : "Error Loading Entry"}
                </h2>
                <p className="text-red-600 mb-4">
                  {error === "Entry not found"
                    ? "The journal entry you're looking for doesn't exist or you don't have access to it."
                    : error}
                </p>
                <Link href="/entries">
                  <Button>Back to All Entries</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link href="/entries">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Entries
              </Button>
            </Link>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={exporting}
                className="border-border text-foreground hover:bg-muted bg-transparent"
              >
                {exporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {exporting ? "Exporting..." : "Export"}
                {entry.export_count > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {entry.export_count}
                  </Badge>
                )}
              </Button>
              <Link href={`/journal/${entry.journal_id}`}>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Continue Session
                </Button>
              </Link>
            </div>
          </div>

          {/* Entry Header */}
          <Card className="border-border bg-card">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 ${entry.color} rounded-full`}></div>
                  <CardTitle className="text-2xl font-serif text-foreground">
                    {entry.title}
                  </CardTitle>
                </div>
                {entry.is_exported && (
                  <Badge variant="outline" className="text-xs">
                    Exported {entry.export_count} time
                    {entry.export_count !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(entry.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{entry.sessionDuration}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {entry.template}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Entry Content */}
          <Card className="border-border bg-card">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <div className="text-foreground leading-relaxed whitespace-pre-wrap font-serif">
                  {entry.content}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          {entry.insights.length > 0 && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span className="font-serif text-foreground">
                    Key Insights
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {entry.insights.map((insight, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg"
                  >
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary-foreground text-xs font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-foreground leading-relaxed">{insight}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Session Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 border-border bg-card text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">
                  {entry.wordCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  Words Written
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border bg-card text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">
                  {entry.aiQuestions}
                </div>
                <div className="text-sm text-muted-foreground">
                  Estimated AI Questions
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border bg-card text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">
                  {entry.insights.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Key Insights
                </div>
              </div>
            </Card>
          </div>

          {/* Call to Action */}
          <Card className="p-8 text-center border-primary bg-card">
            <div className="space-y-4">
              <h3 className="text-xl font-serif font-semibold text-foreground">
                Continue Your Growth
              </h3>
              <p className="text-muted-foreground">
                Ready to build on these insights with another journaling
                session?
              </p>
              <div className="flex justify-center space-x-4">
                <Link href={`/journal/${entry.journal_id}`}>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Continue This Template
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button
                    variant="outline"
                    className="border-border text-foreground hover:bg-muted bg-transparent"
                  >
                    Try Different Template
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
