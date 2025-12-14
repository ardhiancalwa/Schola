"use client";

import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Search,
  ChevronDown,
  GraduationCap,
  Users,
  Calendar as CalendarIcon,
  Loader2,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { AttendanceToggle, AttendanceStatus } from "./attendance-toggle";
import { cn } from "@/lib/utils";

export interface Student {
  id: string;
  nis: string;
  name: string;
  status: AttendanceStatus;
}

export interface AttendanceTableProps {
  students: Student[];
  classes: {
    id: string;
    label: string;
    subject: string;
    education_level: string;
    department: string;
  }[];
  selectedClassId: string;
  onClassChange: (id: string) => void;
  date: Date;
  onDateChange: (date: Date) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
  onSave: () => void;
  isSaving: boolean;
  isLoading: boolean;
  stats: { hadir: number; izin: number; alpha: number; totalStudents: number };
}

export function AttendanceTable({
  students,
  classes,
  selectedClassId,
  onClassChange,
  date,
  onDateChange,
  searchQuery,
  onSearchChange,
  currentPage,
  totalPages,
  onPageChange,
  onStatusChange,
  onSave,
  isSaving,
  isLoading,
  stats,
}: AttendanceTableProps) {
  const selectedClass = classes.find((c) => c.id === selectedClassId);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-neutral">
            {selectedClass?.subject || "Pilih Kelas"}
          </h3>
          <div className="flex items-center gap-4 text-slate-500 text-sm mt-1">
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              {selectedClass
                ? `${selectedClass.education_level} ${
                    selectedClass.department
                  } - ${selectedClass.label.split("-")[1]}`
                : "Kelas belum dipilih"}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" /> {stats.totalStudents} Siswa
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] rounded-full border-slate-200 justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? (
                  format(date, "dd MMMM yyyy", { locale: localeId })
                ) : (
                  <span>Pilih Tanggal</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && onDateChange(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Class Select */}
          <Select value={selectedClassId} onValueChange={onClassChange}>
            <SelectTrigger className="w-[200px] rounded-full border-[#317C74] text-[#317C74] font-medium bg-[#F0FDF9]">
              <SelectValue placeholder="Pilih Kelas" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.label}
                </SelectItem>
              ))}
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
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 rounded-full border-slate-200 bg-transparent focus-visible:ring-[#317C74]"
          />
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#317C74]" />{" "}
            {stats.hadir} Hadir
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#F64C4C]" />{" "}
            {stats.alpha} Alpha
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFA102]" />{" "}
            {stats.izin} Izin
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border border-slate-100 mb-6 overflow-hidden">
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                    <Loader2 className="h-8 w-8 animate-spin text-[#317C74]" />
                    <p>Memuat data siswa...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium text-slate-500 py-4">
                    {student.nis || "-"}
                  </TableCell>
                  <TableCell className="font-bold text-neutral py-4">
                    {student.name}
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <div className="flex justify-end">
                      <AttendanceToggle
                        status={student.status}
                        onStatusChange={(status) =>
                          onStatusChange(student.id, status)
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-32 text-center text-slate-500"
                >
                  {selectedClassId
                    ? "Tidak ada siswa ditemukan"
                    : "Pilih kelas terlebih dahulu"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          {selectedClassId && students.length > 0
            ? `Menampilkan ${(currentPage - 1) * 10 + 1} - ${Math.min(
                currentPage * 10,
                stats.totalStudents
              )} dari ${stats.totalStudents} data`
            : ""}
        </p>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex gap-1 order-2 md:order-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-slate-400"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
              </Button>
              {Array.from(
                { length: Math.min(5, totalPages) },
                (_, i) => i + 1
              ).map((p) => (
                <Button
                  key={p}
                  size="icon"
                  className={cn(
                    "h-8 w-8 rounded-full text-sm",
                    currentPage === p
                      ? "bg-[#317C74] text-white hover:bg-[#2A6B63]"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  )}
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-slate-400"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
              >
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </Button>
            </div>
          )}

          {/* Save Button */}
          {selectedClassId && (
            <Button
              onClick={onSave}
              disabled={isSaving || isLoading}
              className="bg-[#317C74] hover:bg-[#2A6B63] text-white px-8 font-bold rounded-lg w-full md:w-auto order-1 md:order-2"
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
