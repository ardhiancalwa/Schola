import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, CheckCircle2 } from "lucide-react";
import { ReportStatsData } from "@/lib/actions/report";

interface ReportStatsProps {
  stats: ReportStatsData;
}

export function ReportStats({ stats }: ReportStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card 1: Rata-Rata Nilai */}
      <Card className="border-none shadow-sm rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-neutral">
            Rata-Rata Nilai
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary mb-2">
            {stats.averageScore}
          </div>
          {/* Progress Bar (Arbitrary scale for visual, assuming 100 max) */}
          <div className="h-2 w-full bg-slate-100 rounded-full mb-3 overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full"
              style={{ width: `${stats.averageScore}%` }}
            ></div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-success">
            {/* Trends are placeholders in backend for now */}
            <ArrowUp className="w-3 h-3" />
            <span>+0%</span>
            <span className="text-slate-400 font-normal ml-1">
              Stabil dari Semester Lalu
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Kehadiran Siswa */}
      <Card className="border-none shadow-sm rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-neutral">
            Kehadiran Siswa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary mb-2">
            {stats.attendanceRate}%
          </div>
          {/* Progress Bar */}
          <div className="h-2 w-full bg-slate-100 rounded-full mb-3 overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full"
              style={{ width: `${stats.attendanceRate}%` }}
            ></div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-success">
            <ArrowUp className="w-3 h-3" />
            <span>+0%</span>
            <span className="text-slate-400 font-normal ml-1">
              Stabil dari Semester Lalu
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Penyelesaian Tugas */}
      <Card className="border-none shadow-sm rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-neutral">
            Penyelesaian Tugas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary mb-2">
            {stats.submissionRate}%
          </div>
          {/* Progress Bar */}
          <div className="h-2 w-full bg-slate-100 rounded-full mb-3 overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full"
              style={{ width: `${stats.submissionRate}%` }}
            ></div>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
            <CheckCircle2 className="w-3 h-3 text-primary" />
            <span>Tingkat pengumpulan tugas</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
