"use client"

import { useState } from "react"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Student = {
  id: number
  name: string
}

type GradeData = {
  raw: number
  final: number
  index: string
}

export function GradeManager({ students, classId }: { students: Student[], classId: string }) {
  const [assessmentTitle, setAssessmentTitle] = useState("")
  const [weight, setWeight] = useState<number>(20) // Default 20
  const [grades, setGrades] = useState<Record<number, GradeData>>({})

  const calculateGrade = (rawScore: number) => {
     const final = (rawScore * weight) / 100
     let index = 'D'
     if (rawScore > 80) index = 'A'
     else if (rawScore > 70) index = 'B'
     else if (rawScore > 60) index = 'C'
     
     return { final, index }
  }

  const handleScoreChange = (studentId: number, value: string) => {
    // Only allow numbers
    if (value === '') return
    
    const raw = Number(value)
    if (isNaN(raw) || raw < 0 || raw > 100) return

    const { final, index } = calculateGrade(raw)
    
    setGrades(prev => ({
      ...prev,
      [studentId]: { raw, final, index }
    }))
  }
  
  // Recalculate if weight changes
  const handleWeightChange = (newWeight: string) => {
      const w = Number(newWeight)
      setWeight(w)
      // We would ideally recalculate all grades here if they exist
      // For simplicity/performance in this MVP, rely on user to re-input or just use current state for next inputs?
      // Actually, if weight changes, 'final' should update for ALREADY entered grades.
      setGrades(prev => {
          const next = { ...prev }
          Object.keys(next).forEach(key => {
              const id = Number(key)
              const g = next[id]
              const { final } = { final: (g.raw * w) / 100 }
              next[id] = { ...g, final }
          })
          return next
      })
  }

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pengaturan Tugas</CardTitle>
        </CardHeader>
        <CardContent className="flex items-end gap-4">
          <div className="space-y-1 flex-1">
            <label className="text-xs font-medium text-slate-500">Nama Tugas</label>
            <Input 
              value={assessmentTitle} 
              onChange={(e) => setAssessmentTitle(e.target.value)} 
              placeholder="Contoh: UH 1" 
            />
          </div>
          <div className="space-y-1 w-32">
            <label className="text-xs font-medium text-slate-500">Bobot (%)</label>
            <Input 
              type="number" 
              value={weight} 
              onChange={(e) => handleWeightChange(e.target.value)}
              min="0"
              max="100"
            />
          </div>
        </CardContent>
      </Card>

      {/* Grading Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Siswa</TableHead>
              <TableHead className="w-[150px]">Input Score (0-100)</TableHead>
              <TableHead>Final Score (Calc)</TableHead>
              <TableHead>Index (Badge)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => {
              const data = grades[student.id]
              
              return (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      placeholder="0"
                      className="w-24"
                      onChange={(e) => handleScoreChange(student.id, e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-600 font-medium">
                      {data ? data.final.toFixed(1) : "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                     {data ? (
                       <Badge variant={
                           data.index === 'A' ? "default" : // using default (black/primary) or we can customize style if badge variants exist
                           "secondary"
                       } className={
                           data.index === 'A' ? "bg-green-100 text-green-700 hover:bg-green-100" :
                           data.index === 'B' ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
                           data.index === 'C' ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" : 
                           "bg-red-100 text-red-700 hover:bg-red-100"
                       }>
                         {data.index}
                       </Badge>
                     ) : (
                       <span className="text-slate-400">-</span>
                     )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => alert("Nilai berhasil disimpan!")} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
           <Save className="w-4 h-4" />
           Simpan Nilai
        </Button>
      </div>
    </div>
  )
}
