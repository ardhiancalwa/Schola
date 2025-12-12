"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"

// Note: In a real server action, we should use a server-only Supabase client.
// However, since we are reusing the shared client which might be set up for both (or next to it),
// and specific requirement was to create this file. 
// If @/lib/supabase exports a client that works on server (it usually does if configured with env vars), this is fine.
// Ideally usage of `createClient` from `@supabase/ssr` or similar is best for server actions.
// I will assume `@/lib/supabase` is sufficient or I'll adapt if it fails.
// Actually, `src/lib/supabase.ts` uses `process.env` which is available on server.

export async function createAssessment(classId: number | string, title: string, weight: number) {
  try {
    const { data, error } = await supabase
      .from('assessments')
      .insert({
        class_id: classId,
        title,
        weight,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath(`/dashboard/grades/${classId}`)
    return { success: true, data }
  } catch (error) {
    console.error('Error creating assessment:', error)
    return { success: false, error }
  }
}

export async function saveGrade(studentId: number | string, assessmentId: number | string, score: number) {
  try {
    const { data, error } = await supabase
      .from('grades')
      .upsert({
        student_id: studentId,
        assessment_id: assessmentId,
        score,
      }, {
        onConflict: 'student_id, assessment_id'
      })
      .select()

    if (error) throw error
    
    // We might not need to revalidate the whole path if we are just updating a cell, 
    // but to be safe and ensure totals update if we had them:
    // revalidatePath(`/dashboard/grades/${classId}`) // We don't have classId easily here without passing it.
    // Let's assume the client handles the optimistic update or we revalidate manually if needed.
    // Returning success allows client to show toast or green checkmark.
    
    return { success: true, data }
  } catch (error) {
    console.error('Error saving grade:', error)
    return { success: false, error }
  }
}
