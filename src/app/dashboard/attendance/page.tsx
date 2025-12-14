"use client";

import { useEffect, useState, useTransition } from "react";
import { format } from "date-fns";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import {
  AttendanceTable,
  Student,
} from "@/components/attendance/attendance-table";
import {
  getClasses,
  getAttendanceData,
  saveAttendance,
} from "@/lib/actions/attendance";
import { AttendanceStatus } from "@/components/attendance/attendance-toggle";

export default function AttendancePage() {
  // State
  const [date, setDate] = useState<Date>(new Date());
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  // Debounce the search query for fetching logic
  const [debouncedQuery] = useDebounce(searchQuery, 300);

  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    hadir: 0,
    izin: 0,
    alpha: 0,
    totalStudents: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, startTransition] = useTransition();

  // Load Classes
  useEffect(() => {
    getClasses()
      .then(setClasses)
      .catch((err) => {
        console.error("Failed to load classes", err);
        toast.error("Gagal memuat kelas");
      });
  }, []);

  // Load Data
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedClassId) {
        setStudents([]);
        setStats({ hadir: 0, izin: 0, alpha: 0, totalStudents: 0 });
        return;
      }

      setIsLoading(true);
      try {
        const formattedDate = format(date, "yyyy-MM-dd");
        // Use debouncedQuery here so we don't fetch on every keystroke
        const res = await getAttendanceData({
          classId: selectedClassId,
          date: formattedDate,
          page: currentPage,
          query: debouncedQuery,
        });

        // Transform to match Student interface
        const mappedStudents: Student[] = res.students.map((s) => ({
          id: s.id,
          nis: s.nis || "",
          name: s.name,
          status: (s.current_status as AttendanceStatus) || "hadir", // Default to 'hadir'
        }));

        setStudents(mappedStudents);
        setTotalPages(res.totalPages);
        setStats(res.stats);
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat data kehadiran");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedClassId, date, currentPage, debouncedQuery]);

  // Handlers
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status } : s))
    );
  };

  const handleSave = () => {
    if (!selectedClassId) {
      toast.error("Pilih kelas terlebih dahulu");
      return;
    }

    startTransition(async () => {
      const formattedDate = format(date, "yyyy-MM-dd");
      const records = students.map((s) => ({
        student_id: s.id,
        status: s.status || "hadir",
      }));

      const res = await saveAttendance({
        classId: selectedClassId,
        date: formattedDate,
        records,
      });

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="space-y-6 font-sans pb-10">
      <h2 className="text-2xl font-bold text-neutral">Kehadiran</h2>
      <AttendanceTable
        students={students}
        classes={classes}
        selectedClassId={selectedClassId}
        onClassChange={(id) => {
          setSelectedClassId(id);
          setCurrentPage(1);
        }}
        date={date}
        onDateChange={setDate}
        searchQuery={searchQuery}
        // Pass direct setter for immediate UI update
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onStatusChange={handleStatusChange}
        onSave={handleSave}
        isSaving={isSaving}
        isLoading={isLoading}
        stats={stats}
      />
    </div>
  );
}
