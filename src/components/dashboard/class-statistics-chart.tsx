"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  {
    name: "XI A",
    grades: 90,
    attendance: 80,
  },
  {
    name: "XI B",
    grades: 80,
    attendance: 95,
  },
  {
    name: "XI C",
    grades: 81,
    attendance: 90,
  },
  {
    name: "XI D",
    grades: 70,
    attendance: 95,
  },
]

export function ClassStatisticsChart() {
  return (
    <Card className="border border-slate-100 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold text-neutral">Statistik Kelas</CardTitle>
        <span className="text-sm font-medium text-slate-500 cursor-pointer flex items-center gap-1">
             Kelas XI 
             <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 5,
                left: 0,
                bottom: 5,
              }}
              barGap={8}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
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
                 cursor={{ fill: 'transparent' }}
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              />
              <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="rect" 
              />
              <Bar 
                name="Rata-Rata Nilai"
                dataKey="grades" 
                fill="#317C74" 
                radius={[4, 4, 0, 0]} 
                barSize={24}
              />
              <Bar 
                name="Kehadiran"
                dataKey="attendance" 
                fill="#FFA102" 
                radius={[4, 4, 0, 0]} 
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
