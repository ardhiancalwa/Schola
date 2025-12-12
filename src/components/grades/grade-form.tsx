"use client"

import { useState } from "react"
import { Calculator, Save } from "lucide-react"

import { saveGrade } from "@/lib/actions/grades"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Student = {
  id: number
  name: string
}

type Grade = {
  student_id: number
  score: number
}

type Props = {
  students: Student[]
  assessmentId: number
  weight: number
  initialGrades: Grade[]
}

export function GradeForm({ students, assessmentId, weight, initialGrades }: Props) {
  // Map student_id to score
  const [grades, setGrades] = useState<Record<number, string>>(() => {
    const acc: Record<number, string> = {}
    initialGrades.forEach(g => {
      acc[g.student_id] = g.score.toString()
    })
    return acc
  })
  
  const [saving, setSaving] = useState<Record<number, boolean>>({})

  const handleScoreChange = (studentId: number, value: string) => {
    // allow only numbers and empty
    if (value === '' || (!isNaN(Number(value)) && Number(value) <= 100)) {
       setGrades(prev => ({ ...prev, [studentId]: value }))
    }
  }

  const handleSave = async (studentId: number) => {
    const scoreStr = grades[studentId]
    if (!scoreStr) return

    setSaving(prev => ({ ...prev, [studentId]: true }))
    
    await saveGrade(studentId, assessmentId, Number(scoreStr))
    
    setSaving(prev => ({ ...prev, [studentId]: false }))
  }
  
  const calculateIndex = (score: number) => {
    if (score > 80) return 'A'
    if (score > 70) return 'B'
    if (score > 60) return 'C'
    return 'D'
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Nama Siswa</TableHead>
            <TableHead className="w-[150px]">Nilai (0-100)</TableHead>
            <TableHead>Bobot ({weight}%)</TableHead>
            <TableHead>Indeks</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => {
            const rawScore = grades[student.id] ? Number(grades[student.id]) : 0
            const weightedValue = (rawScore * weight) / 100
            const index = calculateIndex(rawScore)
            const isSaving = saving[student.id]

            return (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={grades[student.id] || ''}
                    onChange={(e) => handleScoreChange(student.id, e.target.value)}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calculator className="w-3 h-3" />
                    {weightedValue.toFixed(1)}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                    index === 'A' ? 'bg-green-100 text-green-700' :
                    index === 'B' ? 'bg-blue-100 text-blue-700' :
                    index === 'C' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {index}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleSave(student.id)}
                    disabled={isSaving || !grades[student.id]}
                  >
                    {isSaving ? (
                      <span className="text-xs text-slate-400">Saving...</span>
                    ) : (
                      <Save className="w-4 h-4 text-slate-600 hover:text-indigo-600" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
