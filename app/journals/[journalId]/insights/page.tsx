import { Suspense } from "react"
import JournalInsightsContent from "./insights-content"

export default function JournalInsightsPage({ params }: { params: { journalId: string } }) {
  return (
    <Suspense fallback={<div>Loading insights...</div>}>
      <JournalInsightsContent journalId={params.journalId} />
    </Suspense>
  )
}
