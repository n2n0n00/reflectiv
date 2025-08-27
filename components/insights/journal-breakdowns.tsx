"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, PenTool, Calendar, Target, TrendingUp } from "lucide-react";

interface JournalBreakdownsProps {
  stats: any;
  loading?: boolean;
}

export function JournalBreakdowns({
  stats,
  loading = false,
}: JournalBreakdownsProps) {
  // Loading state
  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-32 animate-pulse" />
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-8 bg-muted rounded w-12 mx-auto mb-2 animate-pulse" />
                <div className="h-3 bg-muted rounded w-16 mx-auto animate-pulse" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-40 animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-muted rounded w-24 animate-pulse" />
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

  const getStatColor = (
    value: number,
    type: "entries" | "words" | "streak"
  ) => {
    if (type === "entries") {
      if (value >= 50) return "text-green-600";
      if (value >= 20) return "text-primary";
      if (value >= 5) return "text-chart-2";
      return "text-muted-foreground";
    }
    if (type === "words") {
      if (value >= 10000) return "text-green-600";
      if (value >= 5000) return "text-primary";
      if (value >= 1000) return "text-chart-2";
      return "text-muted-foreground";
    }
    if (type === "streak") {
      if (value >= 30) return "text-green-600";
      if (value >= 14) return "text-primary";
      if (value >= 7) return "text-chart-2";
      if (value >= 3) return "text-orange-500";
      return "text-muted-foreground";
    }
    return "text-muted-foreground";
  };

  const getProgressVariant = (progress: number) => {
    if (progress >= 50) return "default";
    if (progress >= 30) return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-6">
      {/* Main Statistics Card */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-serif text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Journal Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <div
              className={`text-2xl font-bold ${getStatColor(
                stats.totalEntries,
                "entries"
              )}`}
            >
              {stats.totalEntries}
            </div>
            <div className="text-xs text-muted-foreground">Total Entries</div>
            {stats.totalEntries >= 10 && (
              <Badge
                variant="secondary"
                className="text-xs bg-green-100 text-green-700"
              >
                Consistent
              </Badge>
            )}
          </div>

          <div className="space-y-1">
            <div
              className={`text-2xl font-bold ${getStatColor(
                stats.totalWords,
                "words"
              )}`}
            >
              {stats.totalWords.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Words Written</div>
            {stats.totalWords >= 5000 && (
              <Badge
                variant="secondary"
                className="text-xs bg-blue-100 text-blue-700"
              >
                Prolific
              </Badge>
            )}
          </div>

          <div className="space-y-1">
            <div
              className={`text-2xl font-bold ${getStatColor(
                stats.longestStreak,
                "streak"
              )}`}
            >
              {stats.longestStreak}
            </div>
            <div className="text-xs text-muted-foreground">Longest Streak</div>
            {stats.longestStreak >= 7 && (
              <Badge
                variant="secondary"
                className="text-xs bg-orange-100 text-orange-700"
              >
                🔥 Fire
              </Badge>
            )}
          </div>

          <div className="space-y-1">
            <div
              className={`text-2xl font-bold ${getStatColor(
                stats.currentStreak,
                "streak"
              )}`}
            >
              {stats.currentStreak}
            </div>
            <div className="text-xs text-muted-foreground">Current Streak</div>
            {stats.currentStreak > 0 ? (
              <Badge
                variant="secondary"
                className="text-xs bg-green-100 text-green-700"
              >
                Active
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                Restart
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-serif text-foreground flex items-center gap-2">
            <PenTool className="w-4 h-4 text-chart-2" />
            Writing Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-semibold text-foreground">
                {stats.averageWordsPerEntry}
              </div>
              <div className="text-xs text-muted-foreground">Avg Words</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">
                {stats.activeDays}
              </div>
              <div className="text-xs text-muted-foreground">Active Days</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">
                {stats.templateBreakdown.length}
              </div>
              <div className="text-xs text-muted-foreground">Templates</div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Writing Depth
              </span>
              <Badge variant="outline" className="text-xs">
                {stats.averageWordsPerEntry >= 300
                  ? "Deep"
                  : stats.averageWordsPerEntry >= 150
                  ? "Thoughtful"
                  : stats.averageWordsPerEntry >= 50
                  ? "Concise"
                  : "Brief"}
              </Badge>
            </div>
            <Progress
              value={Math.min(100, (stats.averageWordsPerEntry / 400) * 100)}
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Template Progress */}
      {stats.templateBreakdown.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-serif text-foreground flex items-center gap-2">
              <Target className="w-4 h-4 text-chart-3" />
              Template Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.templateBreakdown.map((template: any, i: number) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 bg-chart-${(i % 4) + 1} rounded-full`}
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
                    <Badge
                      variant={getProgressVariant(template.progress)}
                      className="text-xs"
                    >
                      {template.progress}%
                    </Badge>
                  </div>
                </div>
                <div className="relative">
                  <Progress value={template.progress} className="h-2" />
                  {i === 0 && template.progress > 40 && (
                    <div className="absolute -top-6 right-0">
                      <Badge
                        variant="secondary"
                        className="text-xs bg-yellow-100 text-yellow-700"
                      >
                        Most Used
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Progress Summary */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground text-sm">
                Your Journey
              </span>
            </div>
            {stats.journalingSince && (
              <Badge variant="secondary" className="text-xs">
                Since {stats.journalingSince}
              </Badge>
            )}
          </div>

          <div className="mt-3 space-y-2">
            <div className="text-sm text-foreground">
              <strong>{stats.totalEntries}</strong> entries •{" "}
              <strong>{stats.totalWords.toLocaleString()}</strong> words
            </div>

            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>📊 {stats.activeDays} active days</span>
              {stats.longestStreak > 0 && (
                <span>🔥 {stats.longestStreak} day record</span>
              )}
              <span>
                📝 {stats.templateBreakdown.length} template
                {stats.templateBreakdown.length !== 1 ? "s" : ""}
              </span>
            </div>

            {stats.currentStreak > 0 ? (
              <div className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                🌟 Current {stats.currentStreak}-day streak! Keep it up!
              </div>
            ) : stats.totalEntries > 0 ? (
              <div className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded">
                💪 Ready to start a new streak? Your next entry counts!
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badges */}
      {stats.totalEntries > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-serif text-foreground">
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.totalEntries >= 1 && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700"
                >
                  🌱 First Entry
                </Badge>
              )}
              {stats.totalEntries >= 10 && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700"
                >
                  📚 Consistent Writer
                </Badge>
              )}
              {stats.totalEntries >= 50 && (
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-700"
                >
                  🎯 Dedicated Journaler
                </Badge>
              )}
              {stats.longestStreak >= 7 && (
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-700"
                >
                  🔥 Week Warrior
                </Badge>
              )}
              {stats.longestStreak >= 30 && (
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  💯 Month Master
                </Badge>
              )}
              {stats.totalWords >= 5000 && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-700"
                >
                  ✍️ Word Wizard
                </Badge>
              )}
              {stats.templateBreakdown.length >= 3 && (
                <Badge
                  variant="secondary"
                  className="bg-indigo-100 text-indigo-700"
                >
                  🎨 Template Explorer
                </Badge>
              )}

              {/* If no major achievements yet */}
              {stats.totalEntries < 10 &&
                stats.longestStreak < 7 &&
                stats.totalWords < 1000 && (
                  <div className="text-xs text-muted-foreground italic">
                    Keep journaling to unlock achievements! 🌟
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
