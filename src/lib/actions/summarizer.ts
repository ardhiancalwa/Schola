"use server";

import { createClient } from "@/lib/supabase/server";
import { uploadMaterialPDF } from "@/lib/supabase/storage";
import { ClassLevel } from "@/types/summarizer";
import { normalizeLearningMethod } from "@/lib/learning-method-mapper";
import { summarizeWithGemini } from "@/lib/gemini-summarizer";

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

    // 1. Upload File to Supabase Storage
    const { path, fileName } = await uploadMaterialPDF(file, user.id);
    
    // 2. Summarize with Gemini AI (real processing)
    const startTime = Date.now();
    const summary = await summarizeWithGemini(path, classLevel, gradeNumber, learningMethod);
    const processingTime = (Date.now() - startTime) / 1000; // seconds

    const materialId = crypto.randomUUID();

    // 3. Save to DB
    const { data, error } = await supabase
      .from("material_analyses")
      .insert({
        user_id: user.id,
        class_id: classId,
        material_id: materialId,
        file_name: fileName,
        file_path: path,
        class_level: classLevel,
        grade_number: gradeNumber,
        learning_method: learningMethod,
        summary: summary,
        processing_time: processingTime,
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
