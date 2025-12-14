import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ClassSearchInput } from "./class-search-input";
import { ClassExportButton } from "./class-export-button";
import { StudentActionButtons } from "./student-action-buttons";
import { NumericPagination } from "./numeric-pagination";

interface ProcessedStudent {
  id: string;
  nis: string;
  name: string;
  gender: string;
  attendancePct: number;
  tugas_1: string | number;
  tugas_2: string | number;
  uts: string | number;
  uas: string | number;
  nilai_akhir: string | number;
  semester: string;
}

interface GradeTableProps {
  students: ProcessedStudent[];
  allStudentsForExport: any[];
  totalStudents: number;
  currentPage: number;
  totalPages: number;
  classId: string;
}

export function GradeTable({
  students = [],
  allStudentsForExport = [],
  totalStudents = 0,
  currentPage = 1,
  totalPages = 1,
  classId,
}: GradeTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Client Component: Search Input */}
          <ClassSearchInput />

          <Button
            variant="outline"
            className="rounded-full border-slate-200 text-[#317C74] font-medium gap-2 hidden sm:flex"
          >
            <ChevronsUpDown className="w-4 h-4" /> Nilai Terbesar
          </Button>
        </div>

        {/* Client Component: Export Button */}
        <ClassExportButton data={allStudentsForExport} classId={classId} />
      </div>

      {/* Table */}
      <div className="rounded-md border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-[120px] font-bold text-slate-500 text-center">
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
            {students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-500 text-center">
                    {student.nis || "-"}
                  </TableCell>
                  <TableCell className="font-medium text-neutral">
                    {student.name}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    <span
                      className={cn(
                        (student.attendancePct ?? 0) >= 80
                          ? "text-[#317C74]"
                          : "text-red-500"
                      )}
                    >
                      {student.attendancePct ?? 0}%
                    </span>
                  </TableCell>

                  {/* Grades */}
                  <TableCell className="text-center font-medium text-slate-600">
                    <ScoreBadge value={student.tugas_1} />
                  </TableCell>
                  <TableCell className="text-center font-medium text-slate-600">
                    <ScoreBadge value={student.tugas_2} />
                  </TableCell>
                  <TableCell className="text-center font-medium text-slate-600">
                    <ScoreBadge value={student.uts} />
                  </TableCell>
                  <TableCell className="text-center font-medium text-slate-600">
                    <ScoreBadge value={student.uas} />
                  </TableCell>

                  {/* Nilai Akhir */}
                  <TableCell className="text-center font-bold">
                    <span
                      className={cn(
                        (typeof student.nilai_akhir === "number"
                          ? student.nilai_akhir
                          : 0) >= 75
                          ? "text-[#317C74]"
                          : student.nilai_akhir === "-"
                          ? "text-slate-400"
                          : "text-red-500"
                      )}
                    >
                      {student.nilai_akhir ?? "0"}
                    </span>
                  </TableCell>

                  {/* Aksi */}
                  <TableCell className="text-center">
                    <StudentActionButtons student={student} classId={classId} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-24 text-center text-slate-500"
                >
                  Tidak ada data siswa.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <NumericPagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}

function ScoreBadge({ value }: { value: string | number }) {
  if (value === "-" || value === null || value === undefined)
    return <span className="text-slate-400">-</span>;
  const numCheck = Number(value);
  const isGood = !isNaN(numCheck) && numCheck >= 75;
  return (
    <span className={cn(isGood ? "text-[#317C74]" : "text-red-500")}>
      {value}
    </span>
  );
}
