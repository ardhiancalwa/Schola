"use server";

import { createClient } from "@/lib/supabase/server";

export interface StudentAnalyticsData {
  id: string;
  nis: string;
  name: string;
  gender: string;
  class_name: string;
  attendanceRate: number;
  avgGrade: number; 
  finalGrade: string; 
  performance: "Sangat Baik" | "Cukup Baik" | "Bimbingan";
}

export async function getAllClasses() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("classes")
    .select("id, name, education_level, department, subject")
    .order("name");

  if (error) {
    console.error("Error fetching classes:", error);
    return [];
  }

  return data.map((c) => ({
    id: c.id,
    label: `${c.education_level} ${c.department} - ${c.name}`,
    name: c.name,
    fullLabel: `${c.subject} (${c.education_level} ${c.department})`,
  }));
}

export async function getStudentAnalytics({
  classId,
  page = 1,
  query = "",
}: {
  classId?: string;
  page?: number;
  query?: string;
}) {
  const supabase = await createClient();

  // 1. Check Classes
  const { count: classCount } = await supabase
    .from("classes")
    .select("*", { count: "exact", head: true });

  if (classCount === 0) {
    return {
      noClasses: true,
      students: [],
      stats: {
        totalStudents: 0,
        avgAttendance: 0,
        avgGrade: 0,
        assignmentSubmissionRate: 0,
        needHelpCount: 0,
      },
      totalPages: 0,
    };
  }

  // 2. Define Query Filters
  // Helper to apply filters to any query chain
  const applyFilters = (q: any) => {
    if (classId && classId !== "all") {
      q = q.eq("class_id", classId);
    }
    if (query) {
      q = q.or(`name.ilike.%${query}%,nis.ilike.%${query}%`);
    }
    return q;
  };

  // ---------------------------------------------------------
  // 3. Global Stats Query
  // ---------------------------------------------------------
  let statsQuery = supabase.from("students").select(
    "tugas_1, tugas_2, uts, uas, attendance_logs(status)",
    { count: "exact" }
  );
  
  statsQuery = applyFilters(statsQuery);
  
  const { data: allStatsData, count: totalCount } = await statsQuery;

  // Stats Aggregation
  let globalTotalStudents = totalCount || 0;
  let globalSumAttendance = 0;
  let globalSumFinalGrade = 0;
  let globalSubmittedTasksCount = 0; 
  let globalNeedHelpCount = 0;

  if (allStatsData && allStatsData.length > 0) {
    allStatsData.forEach((s: any) => {
      const logs = s.attendance_logs || [];
      const presentConfig = logs.filter((l: any) => l.status === "hadir").length;
      const attRate = logs.length > 0 ? (presentConfig / logs.length) * 100 : 0;
      globalSumAttendance += attRate;

      const t1 = Number(s.tugas_1 || 0);
      const t2 = Number(s.tugas_2 || 0);
      if (t1 > 0) globalSubmittedTasksCount++;
      if (t2 > 0) globalSubmittedTasksCount++;

      const uts = Number(s.uts || 0);
      const uas = Number(s.uas || 0);
      
      const finalGrade = (t1 + t2 + uts + uas) / 4;
      globalSumFinalGrade += finalGrade;

      if (finalGrade < 70 || attRate < 75) {
        globalNeedHelpCount++;
      }
    });
  }

  const hasStudents = globalTotalStudents > 0;
  const finalGlobalAvgAttendance = hasStudents 
    ? Math.round(globalSumAttendance / globalTotalStudents) 
    : 0;
  const finalGlobalAvgFinalGrade = hasStudents
    ? Math.round(globalSumFinalGrade / globalTotalStudents) 
    : 0;
  const totalPossibleGlobalTasks = globalTotalStudents * 2;
  const finalGlobalSubmissionRate = totalPossibleGlobalTasks > 0
    ? Math.round((globalSubmittedTasksCount / totalPossibleGlobalTasks) * 100)
    : 0;

  // ---------------------------------------------------------
  // 4. List Query
  // ---------------------------------------------------------
  const itemsPerPage = 10;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  let listQuery = supabase
    .from("students")
    .select(
      "id, nis, name, gender, tugas_1, tugas_2, uts, uas, classes(name, education_level, department), attendance_logs(status)"
    )
    .order("name")
    .range(from, to);

  listQuery = applyFilters(listQuery);

  const { data: students, error: listError } = await listQuery;

  if (listError || !students) {
    return {
      noClasses: false,
      students: [],
      stats: {
        totalStudents: 0,
        avgAttendance: 0,
        avgGrade: 0,
        assignmentSubmissionRate: 0,
        needHelpCount: 0,
      },
      totalPages: 0,
    };
  }

  // ---------------------------------------------------------
  // 5. Transform Data
  // ---------------------------------------------------------
  const processedStudents: StudentAnalyticsData[] = students.map((s: any) => {
    const logs = s.attendance_logs || [];
    const present = logs.filter((l: any) => l.status === "hadir").length;
    const attendanceRate = logs.length > 0 ? Math.round((present / logs.length) * 100) : 0;

    const t1 = Number(s.tugas_1 || 0);
    const t2 = Number(s.tugas_2 || 0);
    const uts = Number(s.uts || 0);
    const uas = Number(s.uas || 0);

    let submittedCount = 0;
    if (t1 > 0) submittedCount++;
    if (t2 > 0) submittedCount++;
    const rowSubmissionRate = Math.round((submittedCount / 2) * 100);

    const finalVal = (t1 + t2 + uts + uas) / 4;
    const finalGradeStr = finalVal.toFixed(2);

    const cData = s.classes;
    const c = Array.isArray(cData) ? cData[0] : cData;
    const className = c ? `${c.education_level} ${c.department} - ${c.name}` : "-";

    let performance: "Sangat Baik" | "Cukup Baik" | "Bimbingan" = "Cukup Baik";
    if (finalVal >= 85 && attendanceRate >= 90) {
      performance = "Sangat Baik";
    } else if (finalVal < 70 || attendanceRate < 75) {
      performance = "Bimbingan";
    }

    return {
      id: s.id,
      nis: s.nis || "-",
      name: s.name,
      gender: s.gender || "L",
      class_name: className,
      attendanceRate,
      avgGrade: rowSubmissionRate,
      finalGrade: finalGradeStr,
      performance,
    };
  });

  return {
    noClasses: false,
    students: processedStudents,
    stats: {
      totalStudents: globalTotalStudents,
      avgAttendance: finalGlobalAvgAttendance,
      assignmentSubmissionRate: finalGlobalSubmissionRate,
      avgGrade: finalGlobalAvgFinalGrade,
      needHelpCount: globalNeedHelpCount,
    },
    totalPages: Math.ceil(globalTotalStudents / itemsPerPage),
  };
}