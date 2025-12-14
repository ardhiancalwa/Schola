import { GraduationCap, Users, BookOpen, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ClassStats({
  avgGrade = "0",
  attendance = "0%",
  assignments = "0%",
  needsHelp = 0,
}: {
  avgGrade?: string;
  attendance?: string;
  assignments?: string;
  needsHelp?: number;
}) {
  const stats = [
    {
      label: "Rata-rata Nilai",
      value: avgGrade,
      trend: "+2.5%",
      trendUp: true,
      icon: GraduationCap,
      color: "text-[#317C74]",
      bgColor: "bg-teal-50",
      simple: false,
    },
    {
      label: "Kehadiran",
      value: attendance,
      trend: "+1.2%",
      trendUp: true,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      simple: false,
    },
    {
      label: "Pengumpulan Tugas",
      value: assignments,
      trend: "-5%",
      trendUp: false,
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      simple: false,
    },
    {
      label: "Perlu Bimbingan",
      value: `${needsHelp} Siswa`,
      trend: "Neutral",
      trendUp: true, // Mock
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      simple: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => (
        <Card
          key={i}
          className="p-6 border-slate-100 shadow-sm flex items-center justify-between rounded-xl hover:shadow-md transition-shadow"
        >
          <div className="space-y-1">
            <p className="text-slate-500 font-medium text-sm">{stat.label}</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-neutral">{stat.value}</h3>
              {!stat.simple && (
                <span
                  className={cn(
                    "text-xs font-bold",
                    stat.trendUp ? "text-[#317C74]" : "text-red-500"
                  )}
                >
                  {stat.trendUp ? "↑" : "↓"} {stat.trend}
                </span>
              )}
            </div>
          </div>
          <div
            className={cn(
              "h-12 w-12 rounded-xl flex items-center justify-center",
              stat.bgColor
            )}
          >
            <stat.icon className={cn("w-6 h-6", stat.color)} />
          </div>
        </Card>
      ))}
    </div>
  );
}
