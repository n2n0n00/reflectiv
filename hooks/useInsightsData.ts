"use client";

import { useAuth } from "@/lib/auth-context";
import supabase from "@/lib/supabase/ssrUpdatedClient";
import { useEffect, useState, useCallback } from "react";

export type TimeRange = "week" | "month" | "quarter" | "all";

interface InsightsData {
  keyThemes: string;
  progressIndicators: string;
  patterns: string;
  breakthroughs: string;
  focusAreas: string;
  encouragement: string;
}

interface StatsData {
  totalEntries: number;
  totalWords: number;
  averageWordsPerEntry: number;
  longestStreak: number;
  currentStreak: number;
  templateBreakdown: {
    name: string;
    entries: number;
    progress: number;
    color: string;
  }[];
  activeDays: number;
  journalingSince: string | null;
}

interface ChartsData {
  weeklyProgressData: {
    week: string;
    selfAwareness: number;
    boundaryConfidence: number;
    emotionalClarity: number;
  }[];
  moodTrendData: {
    date: string;
    mood: number;
    entries: number;
  }[];
  templateUsageData: {
    template: string;
    sessions: number;
    progress: number;
    color: string;
  }[];
  dailyActivityData: {
    date: string;
    entries: number;
    words: number;
  }[];
}

export function useInsightsData(
  selectedTimeRange: TimeRange,
  selectedTemplates: string[]
) {
  const { user } = useAuth();
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [charts, setCharts] = useState<ChartsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  const templateColors = [
    "bg-chart-1",
    "bg-chart-2",
    "bg-chart-3",
    "bg-chart-4",
    "bg-primary",
    "bg-accent",
  ];

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Calculate date range
      let fromDate: string | undefined;
      const now = new Date();
      switch (selectedTimeRange) {
        case "week":
          fromDate = new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000
          ).toISOString();
          break;
        case "month":
          fromDate = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
          ).toISOString();
          break;
        case "quarter":
          fromDate = new Date(
            now.getFullYear(),
            now.getMonth() - 3,
            now.getDate()
          ).toISOString();
          break;
        default:
          fromDate = undefined;
      }

      // Fetch entries from Supabase
      let query = supabase
        .from("journal_entries")
        .select(
          `
          id, 
          created_at, 
          template, 
          template_color,
          content,
          journal_id
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (fromDate) {
        query = query.gte("created_at", fromDate);
      }

      if (selectedTemplates.length > 0) {
        query = query.in("template", selectedTemplates);
      }

      const { data: entries, error: fetchError } = await query;

      if (fetchError) {
        throw new Error(`Database error: ${fetchError.message}`);
      }

      if (!entries) {
        throw new Error("No data received from database");
      }

      // Calculate statistics
      const totalEntries = entries.length;
      const totalWords = entries.reduce(
        (sum, entry) =>
          sum +
          (entry.content
            ?.split(/\s+/)
            .filter((word: string | any[]) => word.length > 0).length || 0),
        0
      );

      // Template breakdown with colors
      const templateCounts: Record<string, { count: number; color: string }> =
        {};
      entries.forEach((entry) => {
        if (!templateCounts[entry.template]) {
          templateCounts[entry.template] = {
            count: 0,
            color:
              entry.template_color ||
              templateColors[
                Object.keys(templateCounts).length % templateColors.length
              ],
          };
        }
        templateCounts[entry.template].count++;
      });

      // Calculate streaks
      const entryDates = entries.map((entry) =>
        new Date(entry.created_at).toDateString()
      );
      const uniqueDays = [...new Set(entryDates)].sort();

      let longestStreak = 0;
      let currentStreak = 0;
      let tempStreak = 1;

      if (uniqueDays.length > 0) {
        const today = new Date().toDateString();
        const yesterday = new Date(
          Date.now() - 24 * 60 * 60 * 1000
        ).toDateString();

        // Calculate current streak
        const sortedDates = uniqueDays
          .map((d) => new Date(d))
          .sort((a, b) => b.getTime() - a.getTime());

        if (
          sortedDates[0].toDateString() === today ||
          sortedDates[0].toDateString() === yesterday
        ) {
          currentStreak = 1;
          for (let i = 1; i < sortedDates.length; i++) {
            const dayDiff =
              (sortedDates[i - 1].getTime() - sortedDates[i].getTime()) /
              (1000 * 60 * 60 * 24);
            if (dayDiff <= 1) {
              currentStreak++;
            } else {
              break;
            }
          }
        }

        // Calculate longest streak
        for (let i = 1; i < uniqueDays.length; i++) {
          const prevDate = new Date(uniqueDays[i - 1]);
          const currDate = new Date(uniqueDays[i]);
          const dayDiff =
            (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

          if (dayDiff === 1) {
            tempStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
        longestStreak = Math.max(longestStreak, tempStreak);
      }

      // Get first entry date
      const firstEntry = entries.length > 0 ? entries[0] : null;
      const journalingSince = firstEntry
        ? new Date(firstEntry.created_at).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })
        : null;

      const statsData: StatsData = {
        totalEntries,
        totalWords,
        averageWordsPerEntry:
          totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0,
        longestStreak,
        currentStreak,
        activeDays: uniqueDays.length,
        journalingSince,
        templateBreakdown: Object.entries(templateCounts)
          .map(([name, data]) => ({
            name,
            entries: data.count,
            progress:
              totalEntries > 0
                ? Math.round((data.count / totalEntries) * 100)
                : 0,
            color: data.color,
          }))
          .sort((a, b) => b.entries - a.entries),
      };

      // Generate chart data
      const chartsData = generateChartData(entries);

      // Generate AI insights if we have entries
      let insightsData: InsightsData | null = null;
      if (entries.length > 0) {
        setInsightsLoading(true);
        try {
          const response = await fetch("/api/generate-insights", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              entries: entries.map((entry) => ({
                date: new Date(entry.created_at).toLocaleDateString(),
                template: entry.template,
                content: entry.content,
              })),
              timeframe: selectedTimeRange,
              templates:
                selectedTemplates.length > 0
                  ? selectedTemplates
                  : Object.keys(templateCounts),
            }),
          });

          if (!response.ok) {
            throw new Error(`AI API error: ${response.statusText}`);
          }

          const data = await response.json();
          insightsData = data.insights;
        } catch (insightError) {
          console.error("Insights generation failed:", insightError);
          // Provide fallback insights
          insightsData = generateFallbackInsights(statsData, selectedTimeRange);
        } finally {
          setInsightsLoading(false);
        }
      }

      setStats(statsData);
      setCharts(chartsData);
      setInsights(insightsData);
    } catch (err) {
      console.error("Data fetching error:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, [user, selectedTimeRange, selectedTemplates]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    insights,
    stats,
    charts,
    loading,
    error,
    insightsLoading,
    refetch: fetchData,
  };
}

function generateChartData(entries: any[]): ChartsData {
  // Weekly progress data
  const weeklyData: Record<
    string,
    { words: number; count: number; templates: Set<string> }
  > = {};

  entries.forEach((entry) => {
    const week = getWeekString(new Date(entry.created_at));
    if (!weeklyData[week]) {
      weeklyData[week] = { words: 0, count: 0, templates: new Set() };
    }
    weeklyData[week].words +=
      entry.content?.split(/\s+/).filter((w: string) => w.length > 0).length ||
      0;
    weeklyData[week].count += 1;
    weeklyData[week].templates.add(entry.template);
  });

  const weeklyProgressData = Object.entries(weeklyData)
    .slice(-8) // Last 8 weeks
    .map(([week, data]) => ({
      week,
      selfAwareness: Math.min(100, Math.round(data.words / data.count / 5)), // Avg words per entry / 5
      boundaryConfidence: Math.min(100, data.count * 15), // Entries per week * 15
      emotionalClarity: Math.min(100, data.templates.size * 30), // Template variety * 30
    }));

  // Daily activity for mood trends
  const dailyData: Record<string, { count: number; words: number }> = {};

  entries.forEach((entry) => {
    const date = new Date(entry.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (!dailyData[date]) {
      dailyData[date] = { count: 0, words: 0 };
    }
    dailyData[date].count += 1;
    dailyData[date].words +=
      entry.content?.split(/\s+/).filter((w: string) => w.length > 0).length ||
      0;
  });

  const moodTrendData = Object.entries(dailyData)
    .slice(-14) // Last 14 days
    .map(([date, data]) => ({
      date,
      mood: Math.min(10, Math.max(1, 3 + data.count * 2 + data.words / 100)), // Activity-based mood proxy
      entries: data.count,
    }));

  // Template usage data
  const templateCounts: Record<string, number> = {};
  entries.forEach((entry) => {
    templateCounts[entry.template] = (templateCounts[entry.template] || 0) + 1;
  });

  const templateUsageData = Object.entries(templateCounts)
    .map(([template, count], index) => ({
      template: template
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      sessions: count,
      progress: Math.round((count / entries.length) * 100),
      color: `hsl(var(--chart-${(index % 4) + 1}))`,
    }))
    .sort((a, b) => b.sessions - a.sessions);

  // Daily activity data
  const dailyActivityData = Object.entries(dailyData)
    .slice(-30) // Last 30 days
    .map(([date, data]) => ({
      date,
      entries: data.count,
      words: data.words,
    }));

  return {
    weeklyProgressData,
    moodTrendData,
    templateUsageData,
    dailyActivityData,
  };
}

function generateFallbackInsights(
  stats: StatsData,
  timeframe: TimeRange
): InsightsData {
  const timeFrameText = {
    week: "this week",
    month: "this month",
    quarter: "these past few months",
    all: "throughout your journaling journey",
  }[timeframe];

  return {
    keyThemes: `Your ${stats.totalEntries} entries ${timeFrameText} show a commitment to self-reflection and growth. The variety in your journaling templates suggests you're exploring different aspects of your inner world.`,
    progressIndicators: `You've maintained a ${stats.currentStreak}-day current streak and achieved a ${stats.longestStreak}-day longest streak, demonstrating consistency in your self-care practice. Your average of ${stats.averageWordsPerEntry} words per entry shows thoughtful engagement.`,
    patterns: `You've been most drawn to ${
      stats.templateBreakdown[0]?.name || "journaling"
    } exercises, suggesting this area resonates with your current growth needs. Your ${
      stats.activeDays
    } active journaling days show developing consistency.`,
    breakthroughs: `Every entry represents a moment of pause and self-awareness. Your willingness to show up for yourself ${stats.totalEntries} times ${timeFrameText} is a significant breakthrough in building self-compassion and mindfulness.`,
    focusAreas: `Continue building on your current momentum. Consider exploring templates you haven't used as much to gain new perspectives. Your ${stats.currentStreak}-day streak shows you're developing a sustainable practice.`,
    encouragement: `You've written ${stats.totalWords} words of self-reflection ${timeFrameText} - that's ${stats.totalWords} words of self-compassion and growth. Your dedication to understanding yourself better is truly commendable and will serve you well on your journey.`,
  };
}

function getWeekString(date: Date): string {
  const year = date.getFullYear();
  const onejan = new Date(year, 0, 1);
  const week = Math.ceil(
    ((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7
  );
  return `Week ${week}`;
}
