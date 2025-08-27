import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Download, Trash2 } from "lucide-react"

export function DataPrivacy() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-serif">Data & Privacy</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Export Your Data</h4>
              <p className="text-sm text-muted-foreground">
                Download all your journal entries, insights, and account data
              </p>
            </div>
            <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Delete Account</h4>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data</p>
            </div>
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2">Privacy Commitment</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your journal entries are encrypted and private. We never share your personal data with third parties. All AI
            processing happens securely, and your data is used only to provide personalized insights for your journaling
            experience.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
