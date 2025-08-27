import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Target } from "lucide-react"

interface JournalHeaderProps {
  journal?: {
    id: string
    template: string
    templateColor: string
    startDate: string
    currentSession: {
      date: string
      isComplete: boolean
    }
  }
}

export function JournalHeader({ journal }: JournalHeaderProps) {
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

          {journal && (
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 ${journal.templateColor} rounded-full`}></div>
              <span className="font-serif font-semibold text-foreground">{journal.template}</span>
              <Badge variant="secondary" className="text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(journal.currentSession.date).toLocaleDateString()}
              </Badge>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {journal && (
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <Target className="w-4 h-4" />
              <span>Session in progress</span>
            </div>
          )}

          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted bg-transparent">
              Save & Exit
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
