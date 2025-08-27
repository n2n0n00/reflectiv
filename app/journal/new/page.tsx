import { TemplateSelection } from "@/components/journal/template-selection";
import { JournalHeader } from "@/components/journal/journal-header";

export default function NewJournalPage() {
  return (
    <div className="min-h-screen bg-background">
      <JournalHeader />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <TemplateSelection />
      </main>
    </div>
  );
}
