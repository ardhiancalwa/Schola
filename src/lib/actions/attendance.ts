"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getClasses() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("classes")
    .select("id, name, education_level, department, subject")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching classes:", error);
    return [];
  }

  return data.map((c) => ({
    id: c.id,
    label: `${c.subject} - ${c.name}`,
    name: c.name,
    subject: c.subject,
    education_level: c.education_level,
    department: c.department
  }));
}

export async function getAttendanceData({
  classId,
  date,
  page = 1,
  query = "",
}: {
  classId: string;
  date: string;
  page: number;
  query: string;
}) {
  if (!classId) return { students: [], totalPages: 0, stats: { hadir: 0, izin: 0, alpha: 0, totalStudents: 0 } };

  const supabase = await createClient();
  const itemsPerPage = 10;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  // 1. Fetch Students
  let studentQuery = supabase
    .from("students")
    .select("id, name, nis", { count: "exact" })
    .eq("class_id", classId)
    .order("name");

  if (query) {
    studentQuery = studentQuery.or(`name.ilike.%${query}%,nis.ilike.%${query}%`);
  }

  const { data: students, count, error: studentError } = await studentQuery.range(from, to);

  if (studentError || !students) {
    console.error("Error fetching students:", studentError);
    return { students: [], totalPages: 0, stats: { hadir: 0, izin: 0, alpha: 0, totalStudents: 0 } };
  }

  // 2. Fetch Attendance Logs for Pagination
  const studentIds = students.map((s) => s.id);
  const { data: logs, error: logsError } = await supabase
    .from("attendance_logs")
    .select("student_id, status")
    .eq("class_id", classId)
    .eq("date", date)
    .in("student_id", studentIds);

  if (logsError) console.error("Error fetching logs:", logsError);

  // 3. Stats Calculation (Global for this class/date, ignoring pagination)
  const { data: allLogs } = await supabase
    .from("attendance_logs")
    .select("status")
    .eq("class_id", classId)
    .eq("date", date);

  const stats = {
    hadir: 0,
    izin: 0,
    alpha: 0,
    totalStudents: count || 0,
  };

  if (allLogs) {
    allLogs.forEach((log) => {
      if (log.status === "hadir") stats.hadir++;
      else if (log.status === "izin") stats.izin++;
      else if (log.status === "alpha") stats.alpha++;
    });
  }

  // 4. Merge Data for Table
  const combinedData = students.map((student) => {
    const log = logs?.find((l) => l.student_id === student.id);
    return {
      id: student.id,
      name: student.name,
      nis: student.nis,
      current_status: log?.status || null, 
    };
  });

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 0;

  return { students: combinedData, totalPages, stats };
}

export async function saveAttendance({
  classId,
  date,
  records,
}: {
  classId: string;
  date: string;
  records: { student_id: string; status: string }[];
}) {
  const supabase = await createClient();

  const upsertData = records.map((r) => ({
    student_id: r.student_id,
    class_id: classId,
    date: date,
    status: r.status,
  }));

  const { error } = await supabase
    .from("attendance_logs")
    .upsert(upsertData, {
      onConflict: "student_id,class_id,date",
    });

  if (error) {
    console.error("Error saving attendance:", error);
    return { success: false, message: "Gagal menyimpan data kehadiran." };
  }

  revalidatePath("/dashboard/attendance");
  return { success: true, message: "Data kehadiran berhasil disimpan." };
}
