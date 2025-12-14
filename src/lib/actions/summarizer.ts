"use server";

import { createClient } from "@/lib/supabase/server";
import { uploadMaterialPDF } from "@/lib/supabase/storage";
import { MaterialSummary, ClassLevel, LearningMethod } from "@/types/summarizer";
import { normalizeLearningMethod } from "@/lib/learning-method-mapper";

// Dummy Data Generator
function generateDummySummary(fileName: string): MaterialSummary {
  // We can customize title based on filename to make it feel real
  const baseTitle = fileName.replace(/\.pdf|\.ppt|\.pptx/i, "").replace(/_/g, " ");
  
  return {
    material: {
      title: baseTitle || "Pertidaksamaan Dua Variabel",
      description: "Pertidaksamaan dua variabel merupakan bentuk hubungan matematika yang melibatkan dua variabel (biasanya x dan y) dengan tanda ketidaksamaan. Materi ini digunakan untuk menentukan daerah penyelesaian yang memenuhi suatu kondisi tertentu.",
      sections: [
        {
          title: "Pertidaksamaan Linear Dua Variabel",
          backgroundColor: "yellow",
          points: [
            "Bentuk umum: ax + by < c, ax + by ≤ c, ax + by > c, ax + by ≥ c",
            "Melibatkan dua variabel, biasanya x dan y",
            "Disajikan dalam bentuk grafik garis pada bidang kartesius",
            "Hasil penyelesaian berupa daerah arsiran"
          ]
        },
        {
          title: "Sistem Persamaan Dua Variabel",
          backgroundColor: "blue",
          points: [
            "Gabungan dua atau lebih pertidaksamaan",
            "Daerah penyelesaian adalah irisan dari beberapa daerah",
            "Banyak digunakan dalam soal kontekstual (optimasi sederhana)"
          ]
        }
      ]
    },
    insights: {
      mainTopics: [
        "Pertidaksamaan Linear",
        "Sistem Pertidaksamaan", 
        "Grafik Kartesius",
        "Daerah Penyelesaian",
        "Titik Uji",
        "Garis Batas"
      ],
      difficultAreas: [
        {
          title: "Menentukan Daerah Penyelesaian",
          explanation: "Siswa sering keliru menentukan sisi daerah yang harus diarsir."
        },
        {
          title: "Membedakan Tanda (< vs ≤)",
          explanation: "Kesalahan umum pada penggunaan garis putus-putus dan garis penuh."
        },
        {
          title: "Sistem Pertidaksamaan",
          explanation: "Siswa kesulitan memahami irisan dari beberapa daerah sekaligus."
        }
      ],
      teachingRecommendations: [
        {
          learningStyle: "Visual Learners",
          methods: [
            "Gunakan grafik berwarna pada bidang kartesius",
            "Tampilkan animasi proses arsiran daerah",
            "Perlihatkan perbedaan garis putus-putus vs garis penuh"
          ],
          suggestions: [
            "Sajikan contoh dan non-contoh secara berdampingan",
            "Gunakan mind map atau diagram alur",
            "Tampilkan proses pembuatan grafik secara bertahap"
          ]
        }
      ]
    }
  };
}

export type AnalysisResult = 
  | { success: true; analysisId: string; materialId: string }
  | { success: false; error: string };

export async function analyzeMaterialAction(formData: FormData): Promise<AnalysisResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { success: false, error: "Unauthorized" };

    const file = formData.get("file") as File;
    const classId = formData.get("classId") as string;
    const classLevel = formData.get("classLevel") as ClassLevel;
    const gradeNumber = Number(formData.get("gradeNumber"));
    const learningMethodRaw = formData.get("learningMethod") as string;

    // Normalize Learning Method
    const learningMethod = normalizeLearningMethod(learningMethodRaw);

    if (!file || !classId) return { success: false, error: "Missing required fields" };

    // 1. Upload File
    const { path, fileName } = await uploadMaterialPDF(file, user.id);
    
    // 2. Simulate Processing Delay (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. Generate Dummy Data
    const summary = generateDummySummary(fileName);
    const materialId = crypto.randomUUID(); // Mock material ID concept

    // 4. Save to DB
    const { data, error } = await supabase
      .from("material_analyses")
      .insert({
        user_id: user.id,
        class_id: classId,
        material_id: materialId, // Using a UUID as material_id
        file_name: fileName,
        file_path: path,
        class_level: classLevel,
        grade_number: gradeNumber,
        learning_method: learningMethod,
        summary: summary,
        processing_time: 2.5, // Fake seconds
      })
      .select("id")
      .single();

    if (error) {
       console.error("DB Insert Error:", error);
       return { success: false, error: "Failed to save analysis" };
    }

    return { success: true, analysisId: data.id, materialId };

  } catch (err: any) {
    console.error("Analysis Error:", err);
    return { success: false, error: err.message };
  }
}

export async function getAnalysis(materialId: string) {
    const supabase = await createClient();
    // We query by material_id column as per schema prompt
    const { data, error } = await supabase
        .from("material_analyses")
        .select("*")
        .eq("material_id", materialId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
    
    if (error) return null;
    return data;
}
