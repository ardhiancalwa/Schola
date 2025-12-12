"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card } from "@/components/ui/card"

type Grade = {
  id: number
  error_tags?: string[]
}

type Props = {
  grades: Grade[]
}

export function ErrorAnalysisChart({ grades }: Props) {
  // Logic: Flatten tags, count, sort, take top 5
  const errorCounts: Record<string, number> = {}

  grades.forEach((grade) => {
    if (grade.error_tags && Array.isArray(grade.error_tags)) {
      grade.error_tags.forEach((tag) => {
        errorCounts[tag] = (errorCounts[tag] || 0) + 1
      })
    }
  })

  // Convert to array and sort
  const data = Object.entries(errorCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) // Top 5

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 h-full flex flex-col">
      <h3 className="text-neutral font-bold text-lg font-sans mb-4">
        Analisa Kesalahan Kelas
      </h3>
      
      {data.length > 0 ? (
        <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid vertical={false} horizontal={true} strokeDasharray="3 3" stroke="#e2e8f0" />
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
                  allowDecimals={false}
                />
                <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ 
                        borderRadius: '8px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        backgroundColor: '#ffffff',
                        padding: '12px'
                    }}
                    labelStyle={{ color: '#4B4B4B', fontWeight: 600, marginBottom: '4px' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#317C74" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-lg bg-slate-50/50">
             <p className="font-medium text-sm">Belum ada data kesalahan.</p>
             <p className="text-xs mt-1">Input nilai untuk melihat analisa.</p>
        </div>
      )}
    </Card>
  )
}
