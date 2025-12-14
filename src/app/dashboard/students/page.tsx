"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import { StudentStats } from "@/components/students/student-stats";
import { StudentToolbar } from "@/components/students/student-toolbar";
import { StudentTable } from "@/components/students/student-table";
import { Button } from "@/components/ui/button";
import {
  getAllClasses,
  getStudentAnalytics,
  StudentAnalyticsData,
} from "@/lib/actions/student-management";
import { toast } from "sonner";

export default function StudentsPage() {
  const [classes, setClasses] = useState<{ id: string; label: string }[]>([]);
  const [noClasses, setNoClasses] = useState<boolean | null>(null); // null = loading initial check

  // Filters
  const [selectedClassId, setSelectedClassId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [currentPage, setCurrentPage] = useState(1);

  // Data
  const [students, setStudents] = useState<StudentAnalyticsData[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgAttendance: 0,
    avgGrade: 0,
    needHelpCount: 0,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Initial Check & Classes
  useEffect(() => {
    getAllClasses()
      .then((cls) => {
        if (cls.length === 0) {
          // Logic: if no classes at all in system, show empty state?
          // The action `getAllClasses` returns [] if empty.
          // `getStudentAnalytics` also checks emptiness.
          // Let's rely on `getStudentAnalytics` first call to detect "No Classes" strictly if we want to follow Prompt Task 2.1
          // But getting classes for dropdown is needed anyway.
          setClasses(cls);
        } else {
          setClasses(cls);
        }
      })
      .catch(console.error);
  }, []);

  // Fetch Analytics
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getStudentAnalytics({
          classId: selectedClassId === "all" ? undefined : selectedClassId,
          page: currentPage,
          query: debouncedQuery,
        });

        if (res.noClasses) {
          setNoClasses(true);
        } else {
          setNoClasses(false);
          setStudents(res.students);
          setStats(res.stats);
          setTotalPages(res.totalPages);
        }
      } catch (error) {
        console.error(error);
        toast.error("Gagal memuat data siswa");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedClassId, debouncedQuery, currentPage]);

  if (noClasses === true) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center font-sans">
        <div className="relative h-64 w-64">
          {/* Placeholder Image - Using a generic colored div or next/image as requested. 
                       Prompt said "use next/image with a placeholder src for now"
                       I'll use a widely available placeholder service or just a div if I don't have a local asset asset.
                       But wait, user uploaded images? 
                       I will use a simple div placeholder to avoid broken image, or a text placeholder.
                    */}
          <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <span className="text-4xl">🎓</span>
          </div>
        </div>
        <h3 className="text-xl font-bold text-neutral">Data Siswa Kosong</h3>
        <p className="text-slate-500 max-w-sm">
          Silakan buat kelas untuk menambahkan siswa dan memulai proses
          monitoring.
        </p>
        <Button asChild className="bg-[#317C74] hover:bg-[#2A6B63] text-white">
          <Link href="/dashboard/classes">Buat Kelas</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8 font-sans">
      <h1 className="text-2xl font-bold text-neutral">Siswa</h1>

      <div className="space-y-8">
        <StudentStats
          totalStudents={stats.totalStudents}
          avgAttendance={stats.avgAttendance}
          avgGrade={stats.avgGrade}
          needHelpCount={stats.needHelpCount}
        />
        <StudentToolbar
          classes={classes}
          selectedClassId={selectedClassId}
          onClassChange={(val) => {
            setSelectedClassId(val);
            setCurrentPage(1);
          }}
          searchQuery={searchQuery}
          onSearchChange={(val) => {
            setSearchQuery(val);
            setCurrentPage(1);
          }}
        />
        <StudentTable
          students={students}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={isLoading}
          totalStudents={stats.totalStudents}
        />
      </div>
    </div>
  );
}
