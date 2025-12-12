"use client";

import { useState } from "react";
import { Search, ChevronDown, GraduationCap, Users } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AttendanceToggle, AttendanceStatus } from "./attendance-toggle";
import { cn } from "@/lib/utils";

// Needs to be large enough to show scrolling or pagination visual
interface Student {
  id: string;
  nis: string;
  name: string;
  status: AttendanceStatus;
}

const INITIAL_STUDENTS: Student[] = [
  { id: "1", nis: "5022814693", name: "Chintia Putri", status: "hadir" },
  { id: "2", nis: "5022814693", name: "Chintia Putri", status: "alpha" },
  { id: "3", nis: "5022814693", name: "Chintia Putri", status: "izin" },
  { id: "4", nis: "5022814693", name: "Chintia Putri", status: "hadir" },
  { id: "5", nis: "5022814693", name: "Chintia Putri", status: "hadir" },
  { id: "6", nis: "5022814693", name: "Chintia Putri", status: "hadir" },
];

export function AttendanceTable() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);

  const handleStatusChange = (id: string, newStatus: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-neutral">Matematika</h3>
          <div className="flex items-center gap-4 text-slate-500 text-sm mt-1">
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> Kelas XI A
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" /> 40 Siswa
            </span>
          </div>
        </div>
        <div>
          <Select defaultValue="class-a">
            <SelectTrigger className="w-[180px] rounded-full border-[#317C74] text-[#317C74] font-medium bg-[#F0FDF9]">
              <SelectValue placeholder="Pilih Kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="class-a">Matematika - XI A</SelectItem>
              <SelectItem value="class-b">Matematika - XI B</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-[350px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Temukan siswa berdasarkan Nama atau NIS"
            className="pl-10 rounded-full border-slate-200 bg-transparent focus-visible:ring-[#317C74]"
          />
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#317C74]" /> 20 Hadir
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#F64C4C]" /> 2 Alpha
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFA102]" /> 1 Izin
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border border-slate-100 mb-6">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-[150px] font-bold text-neutral">
                NIS
              </TableHead>
              <TableHead className="font-bold text-neutral min-w-[200px]">
                Nama Lengkap
              </TableHead>
              <TableHead className="font-bold text-neutral text-right pr-12">
                Keterangan Kehadiran
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium text-slate-500 py-4">
                  {student.nis}
                </TableCell>
                <TableCell className="font-bold text-neutral py-4">
                  {student.name}
                </TableCell>
                <TableCell className="text-right py-4">
                  <div className="flex justify-end">
                    <AttendanceToggle
                      status={student.status}
                      onStatusChange={(status) =>
                        handleStatusChange(student.id, status)
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          Menampilkan 1 - 5 dari total data
        </p>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* Pagination */}
          <div className="flex gap-1 order-2 md:order-1">
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

          {/* Save Button */}
          <Button className="bg-[#317C74] hover:bg-[#2A6B63] text-white px-8 font-bold rounded-lg w-full md:w-auto order-1 md:order-2">
            Simpan
          </Button>
        </div>
      </div>
    </div>
  );
}
