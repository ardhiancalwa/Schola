import { ChartLine, Clipboard, Notebook, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ClassStats() {
  const stats = [
    {
      label: "Nilai",
      value: "86.4",
      trend: "+8.5%",
      trendUp: true,
      icon: ChartLine,
      color: "text-[#317C74]",
      bgColor: "bg-[#F0FDF9]",
    },
    {
      label: "Kehadiran",
      value: "85%",
      trend: "-2%",
      trendUp: false,
      icon: Clipboard,
      color: "text-amber-500",
      bgColor: "bg-[#FFFBEB]",
    },
    {
      label: "Tugas",
      value: "80%",
      trend: "+8.5%",
      trendUp: true,
      icon: Notebook,
      color: "text-purple-500",
      bgColor: "bg-[#F3E8FF]",
    },
    {
      label: "Butuh Bimbingan",
      value: "3 Siswa",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-[#EFF6FF]",
      simple: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, i) => (
        <Card
          key={i}
          className="p-6 border-none shadow-sm flex items-center justify-between rounded-xl"
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
