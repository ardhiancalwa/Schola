"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type UpdateStudentPayload = {
  studentId: string;
  name: string;
  nis: string;
  gender: string;
  classId: string;
};

type UpdateStudentGradesPayload = {
  studentId: string;
  tugas_1: number;
  uts: number;
  tugas_2: number;
  uas: number;
  classId: string;
};

export async function updateStudentGrades(payload: UpdateStudentGradesPayload) {
  const supabase = await createClient();
  const { studentId, tugas_1, uts, tugas_2, uas, classId } = payload;

  // Calculation: Simple Average as per requirement (t1 + uts + t2 + uas) / 4
  const nilai_akhir = Math.round((tugas_1 + uts + tugas_2 + uas) / 4);

  try {
    const { error } = await supabase
      .from("students")
      .update({ 
        tugas_1, 
        uts, 
        tugas_2, 
        uas, 
        nilai_akhir 
      })
      .eq("id", studentId);

    if (error) {
      console.error("Error updating grades:", error);
      return { success: false, message: "Gagal memperbarui nilai siswa." };
    }

    revalidatePath(`/dashboard/classes/${classId}`);
    return { success: true, message: "Nilai siswa berhasil diperbarui." };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}


export async function updateStudent(payload: UpdateStudentPayload) {
  const supabase = await createClient();
  const { studentId, name, nis, gender, classId } = payload;

  try {
    const { error } = await supabase
      .from("students")
      .update({ name, nis, gender })
      .eq("id", studentId);

    if (error) {
      console.error("Error updating student:", error);
      return { success: false, message: "Gagal memperbarui data siswa." };
    }

    revalidatePath(`/dashboard/classes/${classId}`);
    return { success: true, message: "Data siswa berhasil diperbarui." };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}

export async function deleteStudent(studentId: string, classId: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", studentId);

    if (error) {
      console.error("Error deleting student:", error);
      return { success: false, message: "Gagal menghapus siswa." };
    }

    revalidatePath(`/dashboard/classes/${classId}`);
    return { success: true, message: "Siswa berhasil dihapus." };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}
