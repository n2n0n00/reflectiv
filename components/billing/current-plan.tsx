import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Zap, Users } from "lucide-react"

const currentPlan = {
  name: "Growth",
  price: "$20",
  period: "/month",
  trialEndsAt: "January 28, 2024",
  daysLeft: 5,
  usage: {
    questionsUsed: 127,
    questionsLimit: 600, // 20 per day * 30 days
    journalsUsed: 2,
    journalsLimit: 2,
  },
}

export function CurrentPlan() {
  const questionsPercentage = (currentPlan.usage.questionsUsed / currentPlan.usage.questionsLimit) * 100

  return (
    <Card className="border-primary bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="font-serif text-foreground">Current Plan: {currentPlan.name}</span>
          </div>
          <Badge className="bg-accent text-accent-foreground">{currentPlan.daysLeft} days left in trial</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Plan Details */}
          <div className="space-y-4">
            <div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-foreground">{currentPlan.price}</span>
                <span className="text-muted-foreground ml-1">{currentPlan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground">After trial ends</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">Trial ends: {currentPlan.trialEndsAt}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">20 questions/day, 2 journals</span>
              </div>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">Questions This Month</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Used</span>
                  <span className="text-foreground">
                    {currentPlan.usage.questionsUsed} / {currentPlan.usage.questionsLimit}
                  </span>
                </div>
                <Progress value={questionsPercentage} className="h-2" />
              </div>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-2">Active Journals</h4>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Used</span>
                <span className="text-foreground">
                  {currentPlan.usage.journalsUsed} / {currentPlan.usage.journalsLimit}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Upgrade Plan</Button>
            <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted bg-transparent">
              Manage Subscription
            </Button>
            <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
              Cancel Trial
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
