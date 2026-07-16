import { Sidebar } from "@/components/tasko/Sidebar";
import { Header } from "@/components/tasko/Header";
import { StatsCards } from "@/components/tasko/StatsCards";
import { ProjectAnalytics } from "@/components/tasko/ProjectAnalytics";
import { Reminders } from "@/components/tasko/Reminders";
import { ProjectList } from "@/components/tasko/ProjectList";
import { TeamCollaboration } from "@/components/tasko/TeamCollaboration";
import { ProjectProgress } from "@/components/tasko/ProjectProgress";
import { MobileAppCard } from "@/components/tasko/MobileAppCard";
import { TimeTracker } from "@/components/tasko/TimeTracker";
import { Button } from "@/components/tasko/ui/button";

// Composizione 1:1 di app/page.tsx del template (dashboard home): unica route
// portata (vedi tasko/layout.tsx), le altre 8 sotto-pagine (tasks/calendar/
// analytics/team/settings/help/logout) non esistono qui — la sidebar le
// rende no-op (vedi Sidebar.tsx). Sidebar con self-entrance "scende"
// (tasko-enter-header), il contenuto principale sale in fade
// (tasko-enter-content), stesso pattern di bistro/sfcc.
export default function TaskoPage() {
  return (
    <div className="flex min-h-screen bg-tasko-background">
      <div className="hidden lg:block tasko-enter-header">
        <Sidebar />
      </div>

      <main className="flex-1 p-3 md:p-4 lg:p-5 lg:ml-64 tasko-enter-content">
        <Header
          title="Dashboard"
          description="Plan, prioritize, and accomplish your tasks with ease."
          actions={
            <>
              <Button className="w-full sm:w-auto h-9 text-sm bg-tasko-primary text-tasko-primary-foreground hover:bg-tasko-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-tasko-primary/30 hover:scale-105">
                + Add Project
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto h-9 text-sm transition-all duration-300 hover:shadow-md hover:scale-105 bg-transparent"
              >
                Import Data
              </Button>
            </>
          }
        />

        <div className="mt-4 md:mt-5 space-y-3 md:space-y-4">
          <StatsCards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
            <div className="lg:col-span-2 space-y-3 md:space-y-4">
              <ProjectAnalytics />
              <TeamCollaboration />
            </div>

            <div className="space-y-3 md:space-y-4">
              <Reminders />
              <ProjectProgress />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <ProjectList />
            <MobileAppCard />
            <TimeTracker />
          </div>
        </div>
      </main>
    </div>
  );
}
