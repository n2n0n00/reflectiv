"use client";

import { useState } from "react";
import { InsightsHeader } from "@/components/insights/insights-header";
import { WeeklySummary } from "@/components/insights/weekly-summary";
import { ProgressCharts } from "@/components/insights/progress-charts";
import { PatternAnalysis } from "@/components/insights/pattern-analysis";
import { JournalBreakdowns } from "@/components/insights/journal-breakdowns";
import { InsightsFilters } from "@/components/insights/insights-filters";
import { useInsightsData, TimeRange } from "@/hooks/useInsightsData";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Brain,
  Calendar,
} from "lucide-react";

export default function InsightsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [templates, setTemplates] = useState<string[]>([]);

  const { insights, stats, charts, loading, error, insightsLoading, refetch } =
    useInsightsData(timeRange, templates);

  const handleFilterChange = (
    newTimeRange: TimeRange,
    newTemplates: string[]
  ) => {
    setTimeRange(newTimeRange);
    setTemplates(newTemplates);
  };

  const handleRefresh = () => {
    refetch();
  };

  // Error state for the entire page
  if (error && !stats) {
    return (
      <div className="min-h-screen bg-background">
        <InsightsHeader />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <p className="font-medium">Failed to load insights data</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="ml-4"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <InsightsHeader />

      <main className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        {/* Filters */}
        <InsightsFilters
          selectedTimeRange={timeRange}
          selectedTemplates={templates}
          onFilterChange={handleFilterChange}
        />

        {/* Error banner if there's a partial error */}
        {error && stats && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Some insights may be incomplete: {error}</span>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-3 h-3 mr-1" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {loading ? (
          /* Full page loading state */
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Weekly Summary Loading */}
              <Card className="border-border bg-card">
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-primary/20 rounded animate-pulse" />
                    <div className="h-6 bg-muted rounded w-48 animate-pulse" />
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-muted rounded animate-pulse" />
                          <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-muted rounded w-full animate-pulse" />
                          <div className="h-3 bg-muted rounded w-4/5 animate-pulse" />
                          <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Charts Loading */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="h-8 bg-muted rounded w-48 animate-pulse" />
                  <div className="h-6 bg-muted rounded w-20 animate-pulse" />
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <Card key={i} className="border-border bg-card">
                      <div className="p-4">
                        <div className="h-6 bg-muted rounded w-32 animate-pulse mb-4" />
                        <div className="h-[300px] bg-muted rounded animate-pulse" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Pattern Analysis Loading */}
              <div className="space-y-6">
                <div className="h-8 bg-muted rounded w-48 animate-pulse" />
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border-border bg-card">
                      <div className="p-4 space-y-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-muted rounded animate-pulse" />
                          <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                        </div>
                        <div className="h-6 bg-muted rounded w-16 animate-pulse" />
                        <div className="h-3 bg-muted rounded w-full animate-pulse" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Loading */}
            <div className="space-y-8">
              <Card className="border-border bg-card">
                <div className="p-4 space-y-4">
                  <div className="h-6 bg-muted rounded w-32 animate-pulse" />
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="text-center">
                        <div className="h-8 bg-muted rounded w-12 mx-auto mb-2 animate-pulse" />
                        <div className="h-3 bg-muted rounded w-16 mx-auto animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          /* Main content */
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Summary Section */}
              <WeeklySummary
                insights={insights}
                loading={false}
                insightsLoading={insightsLoading}
                error={error}
                onRefresh={handleRefresh}
                timeRange={timeRange}
                entryCount={stats?.totalEntries || 0}
              />

              {/* Charts Section */}
              <ProgressCharts charts={charts} loading={false} />

              {/* Pattern Analysis */}
              <PatternAnalysis stats={stats} loading={false} />
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <JournalBreakdowns stats={stats} loading={false} />

              {/* Quick Stats Card */}
              {stats && (
                <Card className="border-border bg-card">
                  <CardContent className="p-6">
                    <h3 className="font-serif font-semibold text-foreground mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Quick Overview
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Journaling since:
                        </span>
                        <span className="font-medium text-foreground">
                          {stats.journalingSince || "Just started"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Active days:
                        </span>
                        <span className="font-medium text-foreground">
                          {stats.activeDays}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Avg words/entry:
                        </span>
                        <span className="font-medium text-foreground">
                          {stats.averageWordsPerEntry}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Templates used:
                        </span>
                        <span className="font-medium text-foreground">
                          {stats.templateBreakdown.length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Insights Generation Status */}
              {stats?.totalEntries === 0 && (
                <Card className="border-muted bg-muted/5">
                  <CardContent className="p-6 text-center">
                    <Brain className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-medium text-foreground mb-2">
                      Start Your Journey
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Write your first journal entry to unlock AI-powered
                      insights about your thoughts and patterns.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Insights become more accurate with more entries
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Footer note */}
        <div className="text-center py-6 border-t border-border">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            Insights are generated from your journal entries and updated in
            real-time
          </p>
        </div>
      </main>
    </div>
  );
}
