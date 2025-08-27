import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Plus } from "lucide-react"

const paymentMethods = [
  {
    id: "pm_001",
    type: "card",
    brand: "visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
  },
]

export function PaymentMethods() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-primary" />
          <span className="font-serif">Payment Methods</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.length > 0 ? (
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-6 bg-primary rounded flex items-center justify-center">
                    <span className="text-xs text-primary-foreground font-bold">{method.brand.toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">•••• •••• •••• {method.last4}</p>
                    <p className="text-sm text-muted-foreground">
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {method.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      Default
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No payment methods added</p>
            <p className="text-sm">Add a payment method for when your trial ends</p>
          </div>
        )}

        <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted bg-transparent">
          <Plus className="w-4 h-4 mr-2" />
          Add Payment Method
        </Button>
      </CardContent>
    </Card>
  )
}
