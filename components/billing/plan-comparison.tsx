import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "$15",
    period: "/month",
    description: "Perfect for getting started",
    features: ["10 questions per day", "1 journal template", "Weekly insights", "Basic export (PDF)", "Email support"],
    current: false,
    popular: false,
  },
  {
    name: "Growth",
    price: "$20",
    period: "/month",
    description: "For deeper exploration",
    features: [
      "20 questions per day",
      "2 journal templates",
      "Advanced weekly insights",
      "Export to PDF & Word",
      "Priority support",
    ],
    current: true,
    popular: true,
  },
  {
    name: "Unlimited",
    price: "$30",
    period: "/month",
    description: "Complete access",
    features: [
      "Unlimited questions per day",
      "All journal templates",
      "Advanced analytics",
      "Premium export options",
      "Priority support",
      "Early access to features",
    ],
    current: false,
    popular: false,
  },
]

export function PlanComparison() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-serif font-bold text-foreground">Choose Your Plan</h2>
        <p className="text-muted-foreground">Upgrade or downgrade anytime. All plans include 7-day free trial.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`border-border bg-card relative ${
              plan.current ? "ring-2 ring-primary shadow-lg" : ""
            } ${plan.popular ? "scale-105" : ""}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                Most Popular
              </Badge>
            )}

            {plan.current && (
              <Badge className="absolute -top-3 right-4 bg-accent text-accent-foreground">Current Plan</Badge>
            )}

            <CardHeader className="text-center space-y-4">
              <CardTitle className="text-xl font-serif text-foreground">{plan.name}</CardTitle>
              <div className="space-y-2">
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.current
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : plan.popular
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                }`}
                disabled={plan.current}
              >
                {plan.current ? "Current Plan" : `Switch to ${plan.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
