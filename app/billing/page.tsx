import { BillingHeader } from "@/components/billing/billing-header"
import { CurrentPlan } from "@/components/billing/current-plan"
import { PlanComparison } from "@/components/billing/plan-comparison"
import { BillingHistory } from "@/components/billing/billing-history"
import { PaymentMethods } from "@/components/billing/payment-methods"

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-background">
      <BillingHeader />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          <CurrentPlan />
          <PlanComparison />
          <div className="grid lg:grid-cols-2 gap-8">
            <PaymentMethods />
            <BillingHistory />
          </div>
        </div>
      </main>
    </div>
  )
}
