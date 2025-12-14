import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, FileText, UserMinus, Users } from "lucide-react";

interface StudentStatsProps {
  totalStudents: number;
  avgAttendance: number;
  avgGrade: number;
  needHelpCount: number;
}

export function StudentStats({
  totalStudents,
  avgAttendance,
  avgGrade,
  needHelpCount,
}: StudentStatsProps) {
  const stats = [
    {
      label: "Total Siswa",
      value: `${totalStudents} Siswa`,
      icon: Users,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      label: "Kehadiran",
      value: `${avgAttendance}%`,
      icon: ClipboardList,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Tugas", // Represents Avg Grade/Task Score
      value: `${avgGrade}%`,
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Butuh Bimbingan",
      value: `${needHelpCount} Siswa`,
      icon: UserMinus,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className="border-none shadow-sm hover:shadow-md transition-shadow rounded-xl"
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-500 mb-1">
                  {stat.label}
                </p>
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
