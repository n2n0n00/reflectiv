import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Receipt, Download } from "lucide-react"

const billingHistory = [
  {
    id: "inv_001",
    date: "2024-01-01",
    amount: "$20.00",
    status: "paid",
    plan: "Growth Plan",
    period: "Jan 1 - Jan 31, 2024",
  },
  {
    id: "inv_002",
    date: "2023-12-01",
    amount: "$15.00",
    status: "paid",
    plan: "Starter Plan",
    period: "Dec 1 - Dec 31, 2023",
  },
]

export function BillingHistory() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Receipt className="w-5 h-5 text-primary" />
          <span className="font-serif">Billing History</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {billingHistory.length > 0 ? (
          <div className="space-y-4">
            {billingHistory.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-foreground">{invoice.plan}</span>
                    <Badge
                      variant={invoice.status === "paid" ? "default" : "secondary"}
                      className="text-xs bg-chart-2 text-white"
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{invoice.period}</p>
                  <p className="text-xs text-muted-foreground">{invoice.date}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-foreground">{invoice.amount}</span>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Receipt className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No billing history yet</p>
            <p className="text-sm">Your invoices will appear here after your trial ends</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
