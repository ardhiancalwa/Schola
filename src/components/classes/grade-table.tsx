"use client";

import {
  Search,
  ChevronDown,
  MonitorUp,
  Trash2,
  Pencil,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
    nis: "5022814693", // Using same NIS as per dummy data request/image
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
    nis: "5022814693",
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
    nis: "5022814693",
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
    nis: "5022814693",
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
    nis: "5022814693",
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
    nis: "5022814693",
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

        {/* User requested Action button in Page Header, but also potentially here. 
            Keeping toolbar clean or moving Export Here if needed. 
            For now, following the specific "Students Table" reqs from prompt which matches standard table toolbar.
        */}
      </div>

      {/* Table */}
      <div className="rounded-md border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-[120px] font-bold text-slate-500">
                NIS
              </TableHead>
              <TableHead className="font-bold text-slate-500 min-w-[200px]">
                Nama Lengkap
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-center">
                Kehadiran
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-center">
                Tugas 1
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-center">
                Tugas 2
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-center">
                UTS
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-center">
                UAS
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-center">
                Nilai Akhir
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-center">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {STUDENTS.map((student, idx) => (
              <TableRow key={idx}>
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
                  <TableCell
                    key={i}
                    className="text-center font-medium text-slate-600"
                  >
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

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-slate-500">
          Menampilkan 1 - 5 dari total data
        </p>
        <div className="flex gap-1.5">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-slate-400 rounded-lg hover:bg-slate-50"
            disabled
          >
            <ChevronDown className="w-4 h-4 rotate-90" />
          </Button>
          <Button
            size="icon"
            className="h-8 w-8 bg-[#317C74] rounded-full text-white hover:bg-[#2A6B63] shadow-md shadow-teal-700/20"
          >
            1
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-slate-500 rounded-full hover:bg-slate-100"
          >
            2
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-slate-500 rounded-full hover:bg-slate-100"
          >
            3
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-slate-400 rounded-lg hover:bg-slate-50"
          >
            <ChevronDown className="w-4 h-4 -rotate-90" />
          </Button>
        </div>
      </div>
    </div>
  );
}
