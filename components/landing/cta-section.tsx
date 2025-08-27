import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground">
            Ready to Transform Your Inner Dialogue?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thousands who've discovered deeper self-understanding through AI-guided journaling. Start your journey
            today with a free 7-day trial.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                Start Your Free Trial
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-muted bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </div>

          <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
            <span>✓ No credit card required</span>
            <span>✓ Cancel anytime</span>
            <span>✓ Full access during trial</span>
          </div>
        </div>
      </div>
    </section>
  )
}
