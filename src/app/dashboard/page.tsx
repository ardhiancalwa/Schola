import { HeroCard } from "@/components/dashboard/hero-card";
import { StatsRow } from "@/components/dashboard/stats-row";
import { ClassStatisticsChart } from "@/components/dashboard/class-statistics-chart";
import { CalendarWidget } from "@/components/dashboard/calendar-widget";
import { StudentNeedHelp } from "@/components/dashboard/student-need-help";
import { getDashboardData } from "@/lib/actions/dashboard";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8 pb-8 font-sans">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          <HeroCard user={data.user} />
          <StatsRow
            totalStudents={data.stats.totalStudents}
            attendanceRate={data.stats.attendanceRate}
            totalClasses={data.stats.totalClasses}
          />
          <ClassStatisticsChart
            data={data.chartData}
            classList={data.classList}
          />
        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-8">
          <CalendarWidget events={data.calendarEvents} />
          <StudentNeedHelp
            students={data.needsHelp}
            classList={data.classList}
          />
        </div>
      </div>
    </div>
  );
}
