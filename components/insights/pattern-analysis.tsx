"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  Calendar,
  Target,
  TrendingUp,
  Flame,
  BookOpen,
} from "lucide-react";

interface PatternAnalysisProps {
  stats: any;
  loading?: boolean;
}

export function PatternAnalysis({
  stats,
  loading = false,
}: PatternAnalysisProps) {
  // Loading state
  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-48 animate-pulse" />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-border bg-card">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                  </div>
                  <div className="h-6 bg-muted rounded w-16 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-full animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-40 animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-muted rounded w-32 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-16 animate-pulse" />
                </div>
                <div className="h-2 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  const patterns = [
    {
      title: "Active Days",
      value: `${stats.activeDays} days`,
      description: "Days you've journaled",
      icon: Calendar,
      color: "text-chart-2",
      trend: stats.activeDays > 7 ? "increasing" : "stable",
    },
    {
      title: "Current Streak",
      value: `${stats.currentStreak} days`,
      description: "Consecutive journaling days",
      icon: Flame,
      color:
        stats.currentStreak > 0 ? "text-orange-500" : "text-muted-foreground",
      trend: stats.currentStreak > 3 ? "hot" : "building",
    },
    {
      title: "Longest Streak",
      value: `${stats.longestStreak} days`,
      description: "Personal best streak record",
      icon: TrendingUp,
      color: "text-primary",
      trend: stats.longestStreak > stats.currentStreak ? "record" : "current",
    },
    {
      title: "Favorite Template",
      value:
        stats.templateBreakdown.length > 0
          ? stats.templateBreakdown[0].name
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l: string) => l.toUpperCase())
          : "None yet",
      description: `${stats.templateBreakdown[0]?.entries || 0} sessions`,
      icon: Target,
      color: "text-chart-3",
      trend: "preferred",
    },
  ];

  const getStreakMessage = (currentStreak: number, longestStreak: number) => {
    if (currentStreak === 0) return "Start a new streak today!";
    if (currentStreak === 1) return "Great start! Keep it going.";
    if (currentStreak >= longestStreak) return "🔥 You're on fire! New record!";
    if (currentStreak >= 7) return "Amazing consistency!";
    if (currentStreak >= 3) return "Building momentum!";
    return "Keep building your habit!";
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 50) return "bg-primary";
    if (progress >= 30) return "bg-chart-2";
    if (progress >= 10) return "bg-chart-3";
    return "bg-muted";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          Pattern Recognition
        </h2>
        <Badge variant="outline" className="text-xs">
          {stats.totalEntries} total entries
        </Badge>
      </div>

      {/* Pattern Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {patterns.map((pattern, i) => (
          <Card
            key={i}
            className="border-border bg-card hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <pattern.icon className={`w-4 h-4 ${pattern.color}`} />
                    <h3 className="font-medium text-foreground text-sm">
                      {pattern.title}
                    </h3>
                  </div>
                  {pattern.trend === "hot" && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-orange-100 text-orange-700"
                    >
                      🔥 Hot
                    </Badge>
                  )}
                  {pattern.trend === "record" && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-100 text-green-700"
                    >
                      📈 Record
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-lg">
                    {pattern.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {pattern.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Streak Motivation */}
      {stats.totalEntries > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Flame
                  className={`w-5 h-5 ${
                    stats.currentStreak > 0
                      ? "text-orange-500"
                      : "text-muted-foreground"
                  }`}
                />
                <div>
                  <p className="font-medium text-foreground">
                    {getStreakMessage(stats.currentStreak, stats.longestStreak)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {stats.currentStreak > 0
                      ? `You're ${
                          stats.longestStreak - stats.currentStreak
                        } days from your record`
                      : "Consistency builds lasting change"}
                  </p>
                </div>
              </div>
              {stats.currentStreak > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-700"
                >
                  {stats.currentStreak} day
                  {stats.currentStreak !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template Usage Analysis */}
      {stats.templateBreakdown.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-serif text-foreground flex items-center gap-2">
              <Target className="w-4 h-4 text-chart-3" />
              Journal Template Patterns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.templateBreakdown.map((template: any, i: number) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 ${getProgressColor(
                        template.progress
                      )} rounded-full`}
                    ></div>
                    <span className="text-sm font-medium text-foreground">
                      {template.name
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">
                      {template.entries} session
                      {template.entries !== 1 ? "s" : ""}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {template.progress}%
                    </Badge>
                  </div>
                </div>
                <div className="relative">
                  <Progress value={template.progress} className="h-2" />
                  {template.progress >= 40 && (
                    <div className="absolute -top-1 right-0">
                      <Badge
                        variant="secondary"
                        className="text-xs bg-green-100 text-green-700 px-1 py-0"
                      >
                        Favorite
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {stats.templateBreakdown.length === 1 && (
              <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/30">
                <p className="text-sm text-muted-foreground text-center">
                  💡 Try exploring different journal templates to gain new
                  perspectives and insights!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Writing Habits Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-serif text-foreground">
              Writing Habits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total Words
                </span>
                <span className="font-semibold text-foreground">
                  {stats.totalWords.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Avg Words per Entry
                </span>
                <span className="font-semibold text-foreground">
                  {stats.averageWordsPerEntry}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Journaling Since
                </span>
                <span className="font-semibold text-foreground">
                  {stats.journalingSince || "Recently"}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Writing Depth</span>
                <span>
                  {stats.averageWordsPerEntry >= 200
                    ? "Deep"
                    : stats.averageWordsPerEntry >= 100
                    ? "Moderate"
                    : "Concise"}
                </span>
              </div>
              <Progress
                value={Math.min(100, (stats.averageWordsPerEntry / 300) * 100)}
                className="h-1 mt-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-serif text-foreground">
              Consistency Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {Math.round(
                  ((stats.currentStreak + stats.longestStreak) / 2) * 10
                )}
                %
              </div>
              <p className="text-sm text-muted-foreground">
                Based on your streaks and activity
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Current Momentum</span>
                <span className="text-foreground">
                  {stats.currentStreak >= 7
                    ? "Excellent"
                    : stats.currentStreak >= 3
                    ? "Good"
                    : stats.currentStreak >= 1
                    ? "Building"
                    : "Start Today"}
                </span>
              </div>
              <Progress
                value={Math.min(100, (stats.currentStreak / 30) * 100)}
                className="h-2"
              />
            </div>

            {stats.currentStreak === 0 && stats.totalEntries > 0 && (
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-center">
                <p className="text-xs text-yellow-800">
                  🌟 Ready to restart your streak?
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Motivational Footer */}
      {stats.totalEntries > 0 && (
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-accent mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">Your Growth Journey</span>
            </div>
            <p className="text-sm text-foreground">
              You've written{" "}
              <strong>{stats.totalWords.toLocaleString()}</strong> words across{" "}
              <strong>{stats.totalEntries}</strong> entries.
              {stats.longestStreak > 0 && (
                <>
                  {" "}
                  Your longest streak of{" "}
                  <strong>{stats.longestStreak} days</strong> shows your
                  commitment to growth.
                </>
              )}
            </p>
            {stats.currentStreak > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Keep your {stats.currentStreak}-day streak alive! 🔥
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
