"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Define Payload Type for Client Compatibility
export type ClassData = {
  name: string;
  education_level: string;
  department: string;
  subject: string;
  learning_method: string;
};

export type StudentData = {
  [key: string]: any;
};

export type CreateClassPayload = {
  classData: ClassData;
  studentsData: StudentData[];
};

export async function getClassDetails(classId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("id", classId)
    .single();

  if (error) return null;
  return data;
}

export async function createClassWithStudents(payload: CreateClassPayload) {
  const supabase = await createClient();

  // 1. Validate Session
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, message: "Unauthorized: Please login first." };
  }

  // 1.5. Ensure User Exists in Public Table (Lazy Sync)
  // This fixes the foreign key constraint error if the user is missing from public.users
  const { error: syncError } = await supabase
    .from("users")
    .upsert({
      id: user.id,
      email: user.email!,
      full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
      avatar_url: user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || "User")}&background=random`,
      is_verified: true, // Assuming valid session means verified enough for this basic sync
    }, { onConflict: "id" });

  if (syncError) {
    console.error("Supabase Error (User Sync):", syncError);
     // Proceeding anyway, hoping it might just be a duplicate key race condition or similar which is fine due to upsert. 
     // But if it fails hard (e.g. schema mismatch), the next step will fail anyway.
  }

  const { classData, studentsData } = payload;
  const { name, education_level, department, subject, learning_method: rawMethod } = classData;

  // 2. Map Learning Method (Use exact string or default)
  const learning_method = rawMethod || "Visual (Gambar, Video, Diagram)";

  const academic_year = "2024/2025";
  const semester = "Ganjil";

  // 3. Insert Class
  const { data: newClass, error: classError } = await supabase
    .from("classes")
    .insert({
      teacher_id: user.id,
      name,
      education_level,
      department,
      subject,
      learning_method,
      academic_year,
      semester,
    })
    .select("id")
    .single();

  if (classError || !newClass) {
    console.error("Supabase Error (Class):", classError);
    return {
      success: false,
      message: "Gagal membuat kelas. Pastikan data valid.",
    };
  }

  const classId = newClass.id;

  // 4. Insert Students (if any)
  if (studentsData && studentsData.length > 0) {
    const studentsToInsert = studentsData.map((s) => {
      const t1 = Number(s.tugas_1 || 0);
      const t2 = Number(s.tugas_2 || 0);
      const uts = Number(s.uts || 0);
      const uas = Number(s.uas || 0);
      const nilai_akhir = Math.round((t1 + t2 + uts + uas) / 4);

      return {
        class_id: classId,
        name: s.name || s.Name || s.Nama,
        nis: s.nis || s.NIS || s.Nis || s.nisn ? String(s.nis || s.NIS || s.Nis || s.nisn) : null,
        gender: s.gender || s.Gender || s.Jenis_Kelamin || "L",
        tugas_1: t1,
        tugas_2: t2,
        uts: uts,
        uas: uas,
        nilai_akhir: nilai_akhir,
        semester: "Ganjil" // Defaulting to Ganjil as per Class default? Or pass it? Class has 'semester' too. Let's use "Ganjil" hardcoded or align with class. Code uses "Ganjil" for Class.
      };
    });

    const { error: studentError } = await supabase
      .from("students")
      .insert(studentsToInsert);

    if (studentError) {
      console.error("Supabase Error (Students):", studentError);
      
      // ROLLBACK: Delete the created class to maintain consistency
      await supabase.from("classes").delete().eq("id", classId);

      return {
        success: false,
        message: "Gagal menyimpan data siswa. Kelas dibatalkan. Periksa format file Anda.",
      };
    }
  }

  // 5. Revalidate & Return
  revalidatePath("/dashboard/classes");
  return { success: true, message: "Kelas dan data siswa berhasil disimpan!" };
}
