"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Brain,
  Target,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { fixTypeOf } from "@/lib/extraUtils";

interface WeeklySummaryProps {
  insights: any;
  loading: boolean;
  insightsLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  timeRange?: string;
  entryCount?: number;
}

export function WeeklySummary({
  insights,
  loading,
  insightsLoading = false,
  error,
  onRefresh,
  timeRange = "week",
  entryCount = 0,
}: WeeklySummaryProps) {
  const timeRangeLabels = {
    week: "Weekly",
    month: "Monthly",
    quarter: "Quarterly",
    all: "All-Time",
  };

  const timeLabel =
    timeRangeLabels[timeRange as keyof typeof timeRangeLabels] || "Weekly";

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-primary/20 rounded animate-pulse" />
              <div className="h-6 bg-muted rounded w-48 animate-pulse" />
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
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
          </CardContent>
        </Card>

        <Card className="border-accent bg-accent/5">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-accent/20 rounded animate-pulse" />
              <div className="h-6 bg-muted rounded w-40 animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded w-full animate-pulse" />
              <div className="h-3 bg-muted rounded w-5/6 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Failed to load insights: {error}</span>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="ml-4"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // No entries state
  if (entryCount === 0) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Journal Entries Yet
          </h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Start journaling to see AI-generated insights about your thoughts,
            patterns, and growth over time.
          </p>
          <Badge variant="secondary">
            Write your first entry to unlock insights
          </Badge>
        </CardContent>
      </Card>
    );
  }

  // No insights but has entries
  if (!insights) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-serif">AI-Generated {timeLabel} Summary</span>
            <Badge variant="secondary" className="text-xs">
              {entryCount} entries
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <div className="text-muted-foreground mb-4">
            <Sparkles className="w-8 h-8 mx-auto mb-2" />
            <p>Generating insights from your journal entries...</p>
          </div>
          {onRefresh && (
            <Button
              variant="outline"
              onClick={onRefresh}
              disabled={insightsLoading}
            >
              <RefreshCw
                className={`w-3 h-3 mr-2 ${
                  insightsLoading ? "animate-spin" : ""
                }`}
              />
              {insightsLoading ? "Generating..." : "Generate Insights"}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const keyThemesText = fixTypeOf(insights);

  const insightSections = [
    {
      title: "Key Themes",
      content: keyThemesText,
      icon: Brain,
      color: "text-primary",
    },
    {
      title: "Progress Indicators",
      content: insights.progressIndicators,
      icon: TrendingUp,
      color: "text-chart-2",
    },
    {
      title: "Patterns & Triggers",
      content: insights.patterns,
      icon: Target,
      color: "text-chart-3",
    },
  ];

  console.log(insightSections);
  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-serif">
                AI-Generated {timeLabel} Summary
              </span>
              <Badge variant="secondary" className="text-xs">
                {entryCount} entries analyzed
              </Badge>
            </CardTitle>
            {onRefresh && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                disabled={insightsLoading}
                className="text-muted-foreground hover:text-foreground"
              >
                <RefreshCw
                  className={`w-3 h-3 ${insightsLoading ? "animate-spin" : ""}`}
                />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          {insightSections.map((section, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center space-x-2">
                <section.icon className={`w-4 h-4 ${section.color}`} />
                <h3 className="font-medium text-foreground">{section.title}</h3>
              </div>
              {insightsLoading ? (
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-full animate-pulse" />
                  <div className="h-3 bg-muted rounded w-4/5 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Breakthrough Moments */}
      <Card className="border-accent bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-accent">
            <Sparkles className="w-5 h-5" />
            <span className="font-serif">Breakthrough Moments</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {insightsLoading ? (
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded w-full animate-pulse" />
              <div className="h-3 bg-muted rounded w-5/6 animate-pulse" />
            </div>
          ) : (
            <p className="text-sm text-foreground leading-relaxed">
              {insights.breakthroughs}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Focus Areas and Encouragement */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-serif text-foreground">
              Areas for Continued Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            {insightsLoading ? (
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-full animate-pulse" />
                <div className="h-3 bg-muted rounded w-4/5 animate-pulse" />
                <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {insights.focusAreas}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg font-serif text-primary">
              Encouragement & Validation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {insightsLoading ? (
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-full animate-pulse" />
                <div className="h-3 bg-muted rounded w-5/6 animate-pulse" />
                <div className="h-3 bg-muted rounded w-4/5 animate-pulse" />
              </div>
            ) : (
              <p className="text-sm text-foreground leading-relaxed">
                {insights.encouragement}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
