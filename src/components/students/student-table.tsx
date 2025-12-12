"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

const students = [
  {
    nis: "5022814693",
    name: "Chintia Putri",
    gender: "Perempuan",
    class: "Kelas X A",
    attendance: 90,
    tasks: 80,
    final: "-",
    performance: "Sangat Baik",
  },
  {
    nis: "5022730581",
    name: "Chintia Putri",
    gender: "Perempuan",
    class: "Kelas X A",
    attendance: 95,
    tasks: 80,
    final: "-",
    performance: "Sangat Baik",
  },
  {
    nis: "5022965207",
    name: "Chintia Putri",
    gender: "Perempuan",
    class: "Kelas X A",
    attendance: 95,
    tasks: 75,
    final: "-",
    performance: "Sangat Baik",
  },
  {
    nis: "5022483016",
    name: "Chintia Putri",
    gender: "Perempuan",
    class: "Kelas X A",
    attendance: 85,
    tasks: 70,
    final: "-",
    performance: "Sangat Baik",
  },
  {
    nis: "5022129754",
    name: "Chintia Putri",
    gender: "Perempuan",
    class: "Kelas X A",
    attendance: 75,
    tasks: 65,
    final: "-",
    performance: "Cukup Baik",
  },
  {
    nis: "5022570492",
    name: "Chintia Putri",
    gender: "Perempuan",
    class: "Kelas X A",
    attendance: 65,
    tasks: 65,
    final: "-",
    performance: "Bimbingan",
  },
  {
    nis: "5022648301",
    name: "Chintia Putri",
    gender: "Perempuan",
    class: "Kelas X A",
    attendance: 65,
    tasks: 60,
    final: "-",
    performance: "Bimbingan",
  },
  {
    nis: "5022792540",
    name: "Chintia Putri",
    gender: "Perempuan",
    class: "Kelas X A",
    attendance: 60,
    tasks: 60,
    final: "-",
    performance: "Bimbingan",
  },
];

export function StudentTable() {
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
            {students.map((student, i) => (
              <TableRow key={i} className="hover:bg-slate-50 border-slate-50">
                <TableCell className="text-slate-500 font-medium">
                  {student.nis}
                </TableCell>
                <TableCell className="font-medium text-neutral">
                  {student.name}
                </TableCell>
                <TableCell className="text-slate-600">
                  {student.gender}
                </TableCell>
                <TableCell className="text-slate-600">
                  {student.class}
                </TableCell>
                <TableCell
                  className={`font-semibold ${
                    student.attendance >= 80
                      ? "text-success"
                      : student.attendance < 70
                      ? "text-danger"
                      : "text-success"
                  }`}
                >
                  {student.attendance}%
                </TableCell>
                <TableCell
                  className={`font-semibold ${
                    student.tasks >= 75
                      ? "text-success"
                      : student.tasks < 65
                      ? "text-danger"
                      : "text-success"
                  }`}
                >
                  {student.tasks}%
                </TableCell>
                <TableCell className="text-slate-500">
                  {student.final}
                </TableCell>
                <TableCell
                  className={`font-bold ${
                    student.performance === "Sangat Baik"
                      ? "text-success"
                      : student.performance === "Bimbingan"
                      ? "text-danger"
                      : "text-neutral"
                  }`}
                >
                  {student.performance}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between p-4 border-t border-slate-100">
        <p className="text-sm text-slate-500">
          Menampilkan 1 - 8 dari total data
        </p>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-full hover:bg-slate-100 text-slate-400 disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-full bg-primary text-white text-sm font-medium flex items-center justify-center">
            1
          </button>
          <button className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500 text-sm font-medium flex items-center justify-center">
            2
          </button>
          <button className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500 text-sm font-medium flex items-center justify-center">
            3
          </button>
          <button className="p-2 rounded-full hover:bg-slate-100 text-slate-400">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}
