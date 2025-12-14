"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClassStatisticsChartProps {
  data: {
    name: string;
    grades: number;
    attendance: number;
  }[];
  classList?: { id: string; name: string }[];
}

export function ClassStatisticsChart({
  data,
  classList = [],
}: ClassStatisticsChartProps) {
  const [selectedClassId, setSelectedClassId] = React.useState<string>("all");

  const filteredData = React.useMemo(() => {
    if (selectedClassId === "all") return data;
    const selectedClass = classList.find((c) => c.id === selectedClassId);
    if (!selectedClass) return data;
    return data.filter((d) => d.name === selectedClass.name);
  }, [data, selectedClassId, classList]);

  return (
    <Card className="border border-slate-100 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold text-neutral">
          Statistik Kelas
        </CardTitle>
        <div className="w-[140px]">
          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
            <SelectTrigger className="h-8 text-xs border-slate-200 focus:ring-[#317C74]">
              <SelectValue placeholder="Semua Kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kelas</SelectItem>
              {classList.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 5, right: 25, left: -20, bottom: 5 }}
              barGap={8}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="rect" />
              <Bar
                name="Rata-Rata Nilai"
                dataKey="grades"
                fill="#317C74"
                radius={[4, 4, 0, 0]}
                barSize={32}
              />
              <Bar
                name="Kehadiran"
                dataKey="attendance"
                fill="#FFA102"
                radius={[4, 4, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
