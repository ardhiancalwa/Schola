import { ReportHeader } from "@/components/reports/report-header";
import { ReportStats } from "@/components/reports/report-stats";
import { ScoreDistributionChart } from "@/components/reports/score-distribution-chart";
import { StudentNeedsHelp } from "@/components/reports/student-needs-help";

export default function ReportsPage() {
  return (
    <div className="space-y-8 pb-8 font-sans">
      <ReportHeader />
      <ReportStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ScoreDistributionChart />
        </div>
        <div>
          <StudentNeedsHelp />
        </div>
      </div>
    </div>
  );
}
