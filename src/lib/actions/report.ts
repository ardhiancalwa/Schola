"use server";

import { createClient } from "@/lib/supabase/server";

// 1. Match Frontend Interfaces Exactly
export interface ReportStatsData {
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  totalStudents: number;
  avgTrend: number;       
  attendanceRate: number;
  attendanceTrend: number;
  submissionRate: number;
}

export interface ScoreDistributionItem {
  range: string; // CHANGED from 'name' to match YAxis dataKey
  count: number; // CHANGED from 'value' to match Bar dataKey
  fill: string;
}

export interface StudentNeedHelpItem {
  id: string;
  nis: string;
  name: string;
  score: number;       
  tasks: string;       
  avatar?: string;
  status: string;      
}

export interface ReportData {
  stats: ReportStatsData;
  scoreDistribution: ScoreDistributionItem[];
  needsHelp: StudentNeedHelpItem[];
}

export async function getClassReportData(classId: string, semester: string = "Ganjil"): Promise<ReportData | null> {
  const supabase = await createClient();

  // 1. Fetch Students
  let query = supabase
    .from("students")
    .select(`
      id, nis, name, gender,
      tugas_1, tugas_2, uts, uas, nilai_akhir,
      attendance_logs (status),
      semester
    `)
    .eq("semester", semester);

  if (classId && classId !== "all") {
    query = query.eq("class_id", classId);
  }

  const { data: students, error } = await query;

  if (error || !students) {
    console.error("Error fetching report data:", error);
    return null;
  }

  // 2. Initialize Buckets with 'range' and 'count' keys
  const buckets: ScoreDistributionItem[] = [
    { range: "0-9",    count: 0, fill: "#F59E0B" },
    { range: "10-19",  count: 0, fill: "#F59E0B" },
    { range: "20-29",  count: 0, fill: "#F59E0B" },
    { range: "30-39",  count: 0, fill: "#F59E0B" },
    { range: "40-49",  count: 0, fill: "#F59E0B" },
    { range: "50-59",  count: 0, fill: "#F59E0B" },
    { range: "60-69",  count: 0, fill: "#F59E0B" },
    { range: "70-79",  count: 0, fill: "#F59E0B" },
    { range: "80-89",  count: 0, fill: "#F59E0B" },
    { range: "90-100", count: 0, fill: "#F59E0B" },
  ];

  const scores: number[] = [];
  let sumAttendanceRate = 0;
  let totalTasksSubmitted = 0;
  const totalPossibleTasksPerStudent = 2; 
  let totalPossibleTasks = 0;

  const strugglingStudentsList: StudentNeedHelpItem[] = [];

  // 3. Process Data
  for (const student of students) {
    // Grades
    const finalScore = Number(student.nilai_akhir) || 0;
    scores.push(finalScore);

    // Histogram Binning
    let binIndex = Math.floor(finalScore / 10);
    if (binIndex > 9) binIndex = 9; 
    if (binIndex < 0) binIndex = 0; 
    
    // Increment the 'count' property
    buckets[binIndex].count += 1;

    // Attendance
    const logs = student.attendance_logs || [];
    const presentCount = logs.filter((l: any) => l.status === "hadir").length;
    const totalLogs = logs.length;
    const attRate = totalLogs > 0 ? (presentCount / totalLogs) * 100 : 0;
    sumAttendanceRate += attRate;

    // Tasks
    const t1 = Number(student.tugas_1 || 0);
    const t2 = Number(student.tugas_2 || 0);
    let submittedCount = 0;
    if (t1 > 0) submittedCount++;
    if (t2 > 0) submittedCount++;
    
    totalTasksSubmitted += submittedCount;
    totalPossibleTasks += totalPossibleTasksPerStudent;

    // Needs Help Logic
    if (finalScore < 70 || attRate < 75) {
      strugglingStudentsList.push({
        id: student.id,
        nis: student.nis || "-",
        name: student.name,
        score: finalScore,
        tasks: `${submittedCount}/${totalPossibleTasksPerStudent}`,
        status: "Perlu Bimbingan"
      });
    }
  }

  // 4. Final Aggregates
  strugglingStudentsList.sort((a, b) => a.score - b.score);
  const needsHelp = strugglingStudentsList.slice(0, 5);

  const totalStudents = students.length;
  const averageScore = totalStudents > 0 
    ? parseFloat((scores.reduce((a, b) => a + b, 0) / totalStudents).toFixed(1)) 
    : 0;
  const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
  
  const avgAttendance = totalStudents > 0 ? Math.round(sumAttendanceRate / totalStudents) : 0;
  const submissionRate = totalPossibleTasks > 0 
    ? Math.round((totalTasksSubmitted / totalPossibleTasks) * 100) 
    : 0;

  return {
    stats: {
      averageScore,
      highestScore,
      lowestScore,
      totalStudents,
      avgTrend: 0,
      attendanceRate: avgAttendance,
      attendanceTrend: 0,
      submissionRate
    },
    scoreDistribution: buckets,
    needsHelp
  };
}
