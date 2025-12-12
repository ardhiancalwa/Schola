"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const data = [
  { range: "90-100", count: 5 },
  { range: "80-89", count: 10 },
  { range: "70-79", count: 20 },
  { range: "60-69", count: 5 },
  { range: "50-59", count: 0 },
  { range: "40-49", count: 0 },
  { range: "30-39", count: 0 },
  { range: "20-29", count: 0 },
  { range: "10-19", count: 0 },
  { range: "0-9", count: 0 },
];

export function ScoreDistributionChart() {
  return (
    <Card className="shadow-sm border-none rounded-xl h-full">
      <CardHeader>
        <CardTitle className="text-base font-bold text-neutral">
          Distribusi Nilai Siswa
        </CardTitle>
        <CardDescription>
          Lihat bagaimana nilai tersebar dari siswa yang tertinggi hingga yang
          perlu dukungan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 0, right: 50, left: 0, bottom: 0 }}
              barSize={20}
            >
              <CartesianGrid
                horizontal={true}
                vertical={true}
                strokeDasharray="3 3"
                stroke="#f1f5f9"
              />
              <XAxis type="number" hide />
              <YAxis
                dataKey="range"
                type="category"
                width={50}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                stroke="#64748B"
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Bar dataKey="count" fill="#FFA102" radius={[0, 4, 4, 0]}>
                <LabelList
                  dataKey="count"
                  position="right"
                  formatter={(val: any) =>
                    typeof val === "number" && val > 0 ? `${val} Siswa` : ""
                  }
                  fontSize={12}
                  fill="#94A3B8"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
