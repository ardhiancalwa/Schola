"use client";

import {
  Search,
  ChevronDown,
  Download,
  MonitorUp,
  Trash2,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Needs to be large enough to show scrolling or pagination visual
const STUDENTS = [
  {
    id: "1",
    nis: "5022814693",
    name: "Chintia Putri",
    attendance: 95,
    t1: 90,
    t2: 90,
    uts: 80,
    uas: null,
    final: 89,
  },
  {
    id: "2",
    nis: "5022730581",
    name: "Chintia Putri",
    attendance: 90,
    t1: 85,
    t2: 85,
    uts: 80,
    uas: null,
    final: 82,
  },
  {
    id: "3",
    nis: "5022965207",
    name: "Chintia Putri",
    attendance: 80,
    t1: 80,
    t2: 80,
    uts: 80,
    uas: null,
    final: 89,
  },
  {
    id: "4",
    nis: "5022483016",
    name: "Chintia Putri",
    attendance: 80,
    t1: 80,
    t2: 80,
    uts: 80,
    uas: null,
    final: 80,
  },
  {
    id: "5",
    nis: "5022129754",
    name: "Chintia Putri",
    attendance: 75,
    t1: 80,
    t2: 80,
    uts: 80,
    uas: null,
    final: 80,
  },
  {
    id: "6",
    nis: "5022570492",
    name: "Chintia Putri",
    attendance: 70,
    t1: 75,
    t2: 75,
    uts: 70,
    uas: null,
    final: 73,
  },
  {
    id: "7",
    nis: "5022648301",
    name: "Chintia Putri",
    attendance: 65,
    t1: 65,
    t2: 70,
    uts: 70,
    uas: null,
    final: 68,
  },
];

export function GradeTable() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-[350px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Temukan siswa berdasarkan Nama atau NIS"
              className="pl-10 rounded-full border-slate-200 bg-transparent focus-visible:ring-[#317C74]"
            />
          </div>
          <Button
            variant="outline"
            className="rounded-full border-slate-200 text-[#317C74] font-medium gap-2 hidden sm:flex"
          >
            <MonitorUp className="w-4 h-4" /> Nilai Terbesar
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border border-slate-100">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-[120px] font-bold text-neutral">
                NIS
              </TableHead>
              <TableHead className="font-bold text-neutral min-w-[200px]">
                Nama Lengkap
              </TableHead>
              <TableHead className="font-bold text-neutral text-center">
                Kehadiran
              </TableHead>
              <TableHead className="font-bold text-neutral text-center">
                Tugas 1
              </TableHead>
              <TableHead className="font-bold text-neutral text-center">
                Tugas 2
              </TableHead>
              <TableHead className="font-bold text-neutral text-center">
                UTS
              </TableHead>
              <TableHead className="font-bold text-neutral text-center">
                UAS
              </TableHead>
              <TableHead className="font-bold text-neutral text-center">
                Nilai Akhir
              </TableHead>
              <TableHead className="font-bold text-neutral text-center">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {STUDENTS.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium text-slate-500">
                  {student.nis}
                </TableCell>
                <TableCell className="font-medium text-neutral">
                  {student.name}
                </TableCell>

                {/* Kehadiran */}
                <TableCell className="text-center font-medium">
                  <span
                    className={cn(
                      student.attendance >= 80
                        ? "text-[#317C74]"
                        : "text-red-500"
                    )}
                  >
                    {student.attendance}%
                  </span>
                </TableCell>

                {/* Scores */}
                {[student.t1, student.t2, student.uts].map((score, i) => (
                  <TableCell key={i} className="text-center font-medium">
                    <span
                      className={cn(
                        score >= 75 ? "text-[#317C74]" : "text-red-500"
                      )}
                    >
                      {score}
                    </span>
                  </TableCell>
                ))}

                {/* UAS (Null handling) */}
                <TableCell className="text-center font-medium text-slate-400">
                  {student.uas ?? "-"}
                </TableCell>

                {/* Final Score */}
                <TableCell className="text-center font-bold">
                  <span
                    className={cn(
                      student.final >= 75 ? "text-[#317C74]" : "text-red-500"
                    )}
                  >
                    {student.final}
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-slate-400 hover:text-blue-500"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination (Simple Visual) */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-slate-500">
          Menampilkan 1 - 5 dari total data
        </p>
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-slate-400"
            disabled
          >
            <ChevronDown className="w-4 h-4 rotate-90" />
          </Button>
          <Button
            size="icon"
            className="h-8 w-8 bg-[#317C74] rounded-full text-white hover:bg-[#2A6B63]"
          >
            1
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-slate-500 rounded-full bg-slate-100"
          >
            2
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-slate-500 rounded-full bg-slate-100"
          >
            3
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-slate-400"
          >
            <ChevronDown className="w-4 h-4 -rotate-90" />
          </Button>
        </div>
      </div>
    </div>
  );
}
