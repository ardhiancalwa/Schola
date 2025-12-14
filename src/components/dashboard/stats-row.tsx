import { ClipboardList, GraduationCap, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsRowProps {
  totalStudents: number;
  attendanceRate: number;
  totalClasses: number;
}

export function StatsRow({
  totalStudents,
  attendanceRate,
  totalClasses,
}: StatsRowProps) {
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
      value: `${attendanceRate}%`,
      icon: ClipboardList,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Total Kelas",
      value: `${totalClasses} Kelas`,
      icon: GraduationCap,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className="border-none shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="flex items-center p-6">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bg} ${stat.color} mr-4`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold text-slate-800">
                  {stat.value}
                </h3>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
