import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    price: "$15",
    period: "/month",
    description: "Perfect for getting started with AI journaling",
    features: [
      "10 questions per day",
      "1 journal template",
      "Weekly insights",
      "Basic export (PDF)",
      "7-day free trial",
    ],
    popular: false,
    buttonText: "Start Free Trial",
  },
  {
    name: "Growth",
    price: "$20",
    period: "/month",
    description: "For deeper exploration and multiple focus areas",
    features: [
      "20 questions per day",
      "2 journal templates",
      "Advanced weekly insights",
      "Export to PDF & Word",
      "Priority support",
      "7-day free trial",
    ],
    popular: true,
    buttonText: "Start Free Trial",
  },
  {
    name: "Unlimited",
    price: "$30",
    period: "/month",
    description: "Complete access for comprehensive self-discovery",
    features: [
      "Unlimited questions per day",
      "All journal templates",
      "Advanced analytics & metrics",
      "Premium export options",
      "Priority support",
      "Early access to new features",
      "7-day free trial",
    ],
    popular: false,
    buttonText: "Start Free Trial",
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start with a 7-day free trial. No credit card required. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`border-border bg-card relative ${plan.popular ? "ring-2 ring-primary shadow-lg scale-105" : ""}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center space-y-4">
                <CardTitle className="text-2xl font-serif text-foreground">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/signup" className="block">
                  <Button
                    className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-secondary hover:bg-secondary/90 text-secondary-foreground"}`}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 space-y-4">
          <p className="text-muted-foreground">All plans include end-to-end encryption and complete data privacy</p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <span>✓ Cancel anytime</span>
            <span>✓ No setup fees</span>
            <span>✓ 30-day money-back guarantee</span>
          </div>
        </div>
      </div>
    </section>
  )
}
