"use client"

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

type Grade = {
  id: number
  error_tags?: string[]
}

type Props = {
  grades: Grade[]
}

export function ErrorChart({ grades }: Props) {
  // Logic: Aggregate error frequencies
  const errorCounts: Record<string, number> = {}

  grades.forEach((grade) => {
    if (grade.error_tags && Array.isArray(grade.error_tags)) {
      grade.error_tags.forEach((tag) => {
        errorCounts[tag] = (errorCounts[tag] || 0) + 1
      })
    }
  })

  const data = Object.entries(errorCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Analisa Kelemahan Kelas</CardTitle>
        <CardDescription>
          Frekuensi kesalahan siswa berdasarkan topik/tag
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis 
                  dataKey="name" 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#6366f1" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[200px] flex flex-col items-center justify-center text-center text-slate-500 border-2 border-dashed rounded-lg bg-slate-50/50 mt-4">
             <p className="font-medium text-sm">Belum ada data kesalahan.</p>
             <p className="text-xs mt-1">Tag kesalahan akan muncul di sini setelah input nilai.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
