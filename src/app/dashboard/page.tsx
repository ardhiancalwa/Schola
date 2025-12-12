import { HeroCard } from "@/components/dashboard/hero-card"
import { StatsRow } from "@/components/dashboard/stats-row"
import { ClassStatisticsChart } from "@/components/dashboard/class-statistics-chart"
import { CalendarWidget } from "@/components/dashboard/calendar-widget"
import { StudentNeedHelp } from "@/components/dashboard/student-need-help"

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-8 font-sans">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left Column (2/3 width) */}
         <div className="lg:col-span-2 space-y-8">
             <HeroCard />
             <StatsRow />
             <ClassStatisticsChart />
         </div>

         {/* Right Column (1/3 width) */}
         <div className="space-y-8">
             <CalendarWidget />
             <StudentNeedHelp />
         </div>
      </div>
    </div>
  )
}
