import { Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClassStats } from "@/components/classes/class-stats";
import { GradeTable } from "@/components/classes/grade-table";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ClassDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ classId: string }>;
  searchParams: Promise<{ page?: string; query?: string; sort?: string }>;
}) {
  const { classId } = await params;
  const { page = "1", query = "", sort = "latest" } = await searchParams;
  const supabase = await createClient();

  // 1. Fetch Class Details
  const { data: classData } = await supabase
    .from("classes")
    .select("*")
    .eq("id", classId)
    .single();

  // 2. Fetch Students (Direct Columns)
  // New Schema: id, nis, name, gender, tugas_1, tugas_2, uts, uas, nilai_akhir, semester
  const itemsPerPage = 10;
  const currentPage = parseInt(page);
  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  let queryBuilder = supabase
    .from("students")
    // Select specific columns + attendance logs
    .select("*, attendance_logs(status)", { count: "exact" })
    .eq("class_id", classId);

  if (query) {
    queryBuilder = queryBuilder.or(
      `name.ilike.%${query}%,nis.ilike.%${query}%`
    );
  }

  if (sort === "name_asc") {
    queryBuilder = queryBuilder.order("name", { ascending: true });
  } else if (sort === "name_desc") {
    queryBuilder = queryBuilder.order("name", { ascending: false });
  } else {
    queryBuilder = queryBuilder.order("created_at", { ascending: false });
  }

  // 3. Fetch Paginated Data
  const { data: rawStudents, count } = await queryBuilder.range(from, to);

  // 4. Fetch ALL Students for Stats and Export (lighter query)
  const { data: allStudents } = await supabase
    .from("students")
    .select(
      "id, nis, name, gender, tugas_1, tugas_2, uts, uas, nilai_akhir, semester, attendance_logs(status)"
    )
    .eq("class_id", classId);

  // 5. Data Mapping
  const processedStudents = (rawStudents || []).map((student: any) => {
    // Attendance
    const logs = student.attendance_logs || [];
    const totalLogs = logs.length;
    const presentLogs = logs.filter((l: any) => l.status === "hadir").length;
    const attendancePct =
      totalLogs > 0 ? Math.round((presentLogs / totalLogs) * 100) : 0;

    // Semester Formatting
    const semesterDisplay = student.semester
      ? `2025/2026 ${student.semester}`
      : "-";

    return {
      id: student.id,
      nis: student.nis,
      name: student.name,
      gender: student.gender,
      attendancePct,
      tugas_1: student.tugas_1 ?? "-",
      tugas_2: student.tugas_2 ?? "-",
      uts: student.uts ?? "-",
      uas: student.uas ?? "-",
      nilai_akhir: student.nilai_akhir ?? "-",
      semester: semesterDisplay,
    };
  });

  // 6. Calculate Aggregated Stats
  let avgClassGrade = 0;
  let avgAttendance = 0;
  let avgAssignment = 0;
  let needsHelpCount = 0;

  if (allStudents && allStudents.length > 0) {
    let totalExitScore = 0;
    let totalStudentsWithScore = 0;
    let totalAttendancePctSum = 0;
    let submittedTasksCount = 0;

    allStudents.forEach((s: any) => {
      // 1. Final Grade Stats
      if (typeof s.nilai_akhir === "number") {
        totalExitScore += s.nilai_akhir;
        totalStudentsWithScore++;
      }

      // 2. Assignment Stats (Submission Rate)
      // Count how many tasks are submitted (> 0)
      const t1 = Number(s.tugas_1 || 0);
      const t2 = Number(s.tugas_2 || 0);
      if (t1 > 0) submittedTasksCount++;
      if (t2 > 0) submittedTasksCount++;

      // 3. Attendance Stats
      const sLogs = s.attendance_logs || [];
      const sTotalLogs = sLogs.length;
      const sPresent = sLogs.filter((l: any) => l.status === "hadir").length;
      const sPct = sTotalLogs > 0 ? (sPresent / sTotalLogs) * 100 : 0;
      totalAttendancePctSum += sPct;

      // 4. Needs Help Criteria
      // Final Grade < 70 OR Attendance < 80
      const currentGrade =
        typeof s.nilai_akhir === "number" ? s.nilai_akhir : 0;
      if (currentGrade < 70 || sPct < 80) {
        needsHelpCount++;
      }
    });

    // Averages
    avgClassGrade =
      totalStudentsWithScore > 0
        ? parseFloat((totalExitScore / totalStudentsWithScore).toFixed(1))
        : 0;

    avgAttendance = Math.round(totalAttendancePctSum / allStudents.length);

    // Assignment Rate: (Submitted / (Students * 2)) * 100
    const totalPossibleTasks = allStudents.length * 2;
    avgAssignment =
      totalPossibleTasks > 0
        ? Math.round((submittedTasksCount / totalPossibleTasks) * 100)
        : 0;
  }

  const totalStudents = count || 0;
  const totalPages = Math.ceil(totalStudents / itemsPerPage);

  return (
    <div className="space-y-8 font-sans pb-20">
      {/* Page Header */}
      <div className="flex flex-col gap-6">
        {/* Sub Header / Class Title Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-neutral">
              {classData?.name || "Nama Kelas"}
            </h2>
            <div className="flex items-center gap-4 text-slate-500 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">
                  {classData?.subject || "Mata Pelajaran"}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" /> {totalStudents} Siswa
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Material Insight Button */}
            <Link href={`/dashboard/classes/${classId}/materials/1/summary`}>
              <Button className="bg-[#317C74] hover:bg-[#2A6B63] text-white gap-2 font-semibold rounded-full px-6 shadow-md shadow-teal-700/20">
                Ringkasan & Insight Materi <Sparkles className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        <ClassStats
          avgGrade={avgClassGrade.toString()}
          attendance={`${avgAttendance}%`}
          assignments={`${avgAssignment}%`}
          needsHelp={needsHelpCount}
        />

        {/* Pass fetched students to GradeTable */}
        <GradeTable
          students={processedStudents}
          allStudentsForExport={allStudents || []}
          totalStudents={totalStudents}
          currentPage={currentPage}
          totalPages={totalPages}
          classId={classId}
        />
      </div>
    </div>
  );
}
