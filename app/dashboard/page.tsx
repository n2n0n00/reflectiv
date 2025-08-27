import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { JournalOverview } from "@/components/dashboard/journal-overview";
import { RecentEntries } from "@/components/dashboard/recent-entries";
import { WeeklyProgress } from "@/components/dashboard/weekly-progress";
import { QuickActions } from "@/components/dashboard/quick-actions";
// import { TemplateSelector } from "@/components/dashboard/template-selector";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <JournalOverview />
            <RecentEntries />
            {/* <TemplateSelector /> */}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <QuickActions />
            <WeeklyProgress />
          </div>
        </div>
      </main>
    </div>
  );
}
