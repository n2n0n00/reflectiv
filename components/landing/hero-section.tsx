import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function HeroSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight">
                Transform Your Thoughts Into <span className="text-primary">Insights</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Break free from overthinking, people-pleasing, and self-doubt through AI-guided therapeutic journaling.
                Get personalized questions that lead to real breakthroughs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                  Start Your 7-Day Free Trial
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-muted bg-transparent"
              >
                See How It Works
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <Card className="p-6 bg-card border-border shadow-lg">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground text-sm font-medium">AI</span>
                  </div>
                  <div className="bg-muted rounded-lg p-3 flex-1">
                    <p className="text-sm text-foreground">
                      I noticed you mentioned feeling overwhelmed at work. Can you tell me about a specific moment this
                      week when that feeling was strongest?
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 justify-end">
                  <div className="bg-primary rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-primary-foreground">
                      Yesterday during the team meeting when everyone was talking over each other and I couldn't get a
                      word in.
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-secondary-foreground text-sm font-medium">You</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground text-sm font-medium">AI</span>
                  </div>
                  <div className="bg-muted rounded-lg p-3 flex-1">
                    <p className="text-sm text-foreground">
                      That sounds frustrating. What thoughts went through your mind when you realized you couldn't
                      contribute?
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
              Live Preview
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
