import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const weeklyStats = {
  entriesThisWeek: 5,
  entriesGoal: 7,
  questionsAnswered: 47,
  insightsGenerated: 3,
  streakDays: 12,
}

const progressMetrics = [
  {
    label: "Weekly Goal",
    current: weeklyStats.entriesThisWeek,
    target: weeklyStats.entriesGoal,
    percentage: (weeklyStats.entriesThisWeek / weeklyStats.entriesGoal) * 100,
  },
  {
    label: "Self-Awareness",
    current: 78,
    target: 100,
    percentage: 78,
  },
  {
    label: "Emotional Clarity",
    current: 65,
    target: 100,
    percentage: 65,
  },
]

export function WeeklyProgress() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-serif text-foreground">This Week's Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-primary">{weeklyStats.entriesThisWeek}</div>
            <div className="text-xs text-muted-foreground">Entries</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-secondary">{weeklyStats.questionsAnswered}</div>
            <div className="text-xs text-muted-foreground">Questions</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-accent">{weeklyStats.insightsGenerated}</div>
            <div className="text-xs text-muted-foreground">Insights</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-chart-1">{weeklyStats.streakDays}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-4">
          {progressMetrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground">{metric.label}</span>
                <span className="text-muted-foreground">
                  {metric.current}
                  {metric.target === 100 ? "%" : `/${metric.target}`}
                </span>
              </div>
              <Progress value={metric.percentage} className="h-2" />
            </div>
          ))}
        </div>

        {/* Encouragement Message */}
        <div className="bg-muted rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">
            You're making great progress! Keep up the consistent journaling to unlock deeper insights.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
