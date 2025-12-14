import { getClassReportData } from "@/lib/actions/report";
import { getAllClasses } from "@/lib/actions/student-management";
import { ReportHeader } from "@/components/reports/report-header";
import { ReportStats } from "@/components/reports/report-stats";
import { ScoreDistributionChart } from "@/components/reports/score-distribution-chart";
import { StudentNeedsHelp } from "@/components/reports/student-needs-help";
import { Loader2 } from "lucide-react";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: { classId?: string; semester?: string };
}) {
  const params = await searchParams; // Next.js 15+ await searchParams usually
  // Fetch Classes for Filter
  const classes = await getAllClasses();

  // Determine Class ID
  const defaultClassId = classes.length > 0 ? classes[0].id : "";
  const selectedClassId = params.classId || defaultClassId;
  const selectedSemester = params.semester || "Ganjil";

  // Fetch Report Data
  // If no classes exist, this might return null or handle gracefully
  const reportData = selectedClassId
    ? await getClassReportData(selectedClassId, selectedSemester)
    : null;

  if (!classes.length) {
    return (
      <div className="p-8 text-center text-slate-500">
        Belum ada data kelas. Silakan buat kelas terlebih dahulu.
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8 font-poppins">
      <ReportHeader classes={classes} />

      {!reportData ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#317C74]" />
          <p>Memuat data laporan...</p>
        </div>
      ) : (
        <>
          <ReportStats stats={reportData.stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ScoreDistributionChart data={reportData.scoreDistribution} />
            </div>
            <div>
              <StudentNeedsHelp students={reportData.needsHelp} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
