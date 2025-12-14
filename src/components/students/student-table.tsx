"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { StudentAnalyticsData } from "@/lib/actions/student-management";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StudentTableProps {
  students: StudentAnalyticsData[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  totalStudents: number;
}

export function StudentTable({
  students,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
  totalStudents,
}: StudentTableProps) {
  const getPerformanceColor = (status: string) => {
    switch (status) {
      case "Sangat Baik":
        return "text-emerald-600";
      case "Bimbingan":
        return "text-red-600";
      default:
        return "text-slate-900"; // Cukup Baik / Neutral
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score < 70) return "text-red-600";
    return "text-emerald-600"; // Assuming green default per design snippets or neutral.
  };

  return (
    <Card className="rounded-xl border-none shadow-sm overflow-hidden bg-white">
      <div className="p-0">
        <Table>
          <TableHeader className="bg-white border-b border-slate-100">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-bold text-neutral">NIS</TableHead>
              <TableHead className="font-bold text-neutral">
                Nama Lengkap
              </TableHead>
              <TableHead className="font-bold text-neutral">
                Jenis Kelamin
              </TableHead>
              <TableHead className="font-bold text-neutral">Kelas</TableHead>
              <TableHead className="font-bold text-neutral">
                Kehadiran
              </TableHead>
              <TableHead className="font-bold text-neutral">Tugas</TableHead>
              <TableHead className="font-bold text-neutral">
                Nilai Akhir
              </TableHead>
              <TableHead className="font-bold text-neutral">Performa</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                    <Loader2 className="h-8 w-8 animate-spin text-[#317C74]" />
                    <p>Memuat data siswa...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : students.length > 0 ? (
              students.map((student) => (
                <TableRow
                  key={student.id}
                  className="hover:bg-slate-50 border-slate-50"
                >
                  <TableCell className="text-slate-500 font-medium">
                    {student.nis}
                  </TableCell>
                  <TableCell className="font-medium text-neutral">
                    {student.name}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {student.gender === "L"
                      ? "Laki-laki"
                      : student.gender === "P"
                      ? "Perempuan"
                      : student.gender || "-"}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {student.class_name}
                  </TableCell>
                  <TableCell
                    className={`font-semibold ${getScoreColor(
                      student.attendanceRate
                    )}`}
                  >
                    {student.attendanceRate}%
                  </TableCell>
                  <TableCell
                    className={`font-semibold ${getScoreColor(
                      student.avgGrade
                    )}`}
                  >
                    {student.avgGrade}%
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {student.finalGrade ?? "-"}
                  </TableCell>
                  <TableCell
                    className={`font-bold ${getPerformanceColor(
                      student.performance
                    )}`}
                  >
                    {student.performance}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-32 text-center text-slate-500"
                >
                  Tidak ada data siswa.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between p-4 border-t border-slate-100">
        <p className="text-sm text-slate-500">
          {totalStudents > 0
            ? `Menampilkan ${(currentPage - 1) * 10 + 1} - ${Math.min(
                currentPage * 10,
                totalStudents
              )} dari ${totalStudents} data`
            : "Tidak ada data"}
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full hover:bg-slate-100 text-slate-400 disabled:opacity-50"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from(
              { length: Math.min(5, totalPages) },
              (_, i) => i + 1
            ).map((p) => (
              <Button
                key={p}
                size="icon"
                className={cn(
                  "rounded-full text-sm font-medium",
                  currentPage === p
                    ? "bg-[#317C74] text-white hover:bg-[#2A6B63]"
                    : "bg-transparent text-slate-500 hover:bg-slate-100"
                )}
                onClick={() => onPageChange(p)}
              >
                {p}
              </Button>
            ))}

            <Button
              size="icon"
              variant="ghost"
              className="rounded-full hover:bg-slate-100 text-slate-400 disabled:opacity-50"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
