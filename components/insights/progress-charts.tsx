"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, BarChart3, Activity } from "lucide-react";

interface ProgressChartsProps {
  charts: any;
  loading?: boolean;
}

export function ProgressCharts({
  charts,
  loading = false,
}: ProgressChartsProps) {
  // Loading state
  if (loading || !charts) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-muted rounded w-48 animate-pulse" />
          <div className="h-6 bg-muted rounded w-20 animate-pulse" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="border-border bg-card">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-32 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-40 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-[250px] bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    weeklyProgressData,
    moodTrendData,
    templateUsageData,
    dailyActivityData,
  } = charts;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-md">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey === "mood" && "/10"}
              {entry.dataKey !== "mood" &&
                entry.dataKey !== "sessions" &&
                entry.dataKey !== "entries" &&
                "%"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          Progress Analytics
        </h2>
        <Badge variant="secondary" className="text-xs">
          {weeklyProgressData?.length || 0} data points
        </Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Growth Metrics Chart */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-serif text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Growth Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weeklyProgressData && weeklyProgressData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyProgressData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--muted))"
                  />
                  <XAxis
                    dataKey="week"
                    fontSize={12}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    fontSize={12}
                    stroke="hsl(var(--muted-foreground))"
                    domain={[0, 100]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="selfAwareness"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    name="Self-Awareness"
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="emotionalClarity"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={3}
                    name="Emotional Clarity"
                    dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="boundaryConfidence"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={3}
                    name="Boundary Confidence"
                    dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No growth data available yet</p>
                  <p className="text-sm">
                    Keep journaling to see your progress!
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Mood Trends Chart */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-serif text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent" />
              Daily Activity Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            {moodTrendData && moodTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={moodTrendData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--muted))"
                  />
                  <XAxis
                    dataKey="date"
                    fontSize={12}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    domain={[1, 10]}
                    fontSize={12}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke="hsl(var(--accent))"
                    fill="hsl(var(--accent))"
                    fillOpacity={0.3}
                    strokeWidth={3}
                    name="Activity Score"
                    dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No activity data available yet</p>
                  <p className="text-sm">
                    Start journaling to track your patterns!
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Template Usage Chart */}
      {/* <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-serif text-foreground">
            Journal Template Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          {templateUsageData && templateUsageData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={templateUsageData}
                layout="horizontal"
                margin={{ left: 120, right: 20, top: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--muted))"
                />
                <XAxis
                  type="number"
                  fontSize={12}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  dataKey="template"
                  type="category"
                  width={120}
                  fontSize={12}
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ textAnchor: "end" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="sessions"
                  fill="hsl(var(--primary))"
                  name="Sessions"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No template usage data available</p>
                <p className="text-sm">
                  Try different journal templates to see your preferences!
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card> */}

      {/* Additional Daily Activity Chart if available */}
      {dailyActivityData && dailyActivityData.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-serif text-foreground">
              Daily Writing Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={dailyActivityData.slice(-14)}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--muted))"
                />
                <XAxis
                  dataKey="date"
                  fontSize={12}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="words"
                  stroke="hsl(var(--chart-4))"
                  fill="hsl(var(--chart-4))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  name="Words Written"
                />
                <Area
                  type="monotone"
                  dataKey="entries"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name="Entries"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
