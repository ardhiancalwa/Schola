import { ClipboardList, GraduationCap, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    label: "Total Siswa",
    value: "120 Siswa",
    icon: Users,
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    label: "Kehadiran",
    value: "80%",
    icon: ClipboardList,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  {
    label: "Total Kelas",
    value: "9 Kelas",
    icon: GraduationCap,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

export function StatsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
