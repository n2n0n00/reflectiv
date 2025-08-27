import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CreditCard } from "lucide-react"

export function BillingHeader() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex items-center space-x-3">
            <CreditCard className="w-5 h-5 text-primary" />
            <span className="font-serif font-semibold text-foreground text-xl">Billing & Plans</span>
          </div>
        </div>
      </div>
    </header>
  )
}
