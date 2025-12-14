import { createClient } from "@/lib/supabase/server";

export async function uploadMaterialPDF(file: File, userId: string) {
  const supabase = await createClient();
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.name.replace(/\s+/g, "_")}`;
  const path = `${userId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from("materials")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL? Or just signed URL later?
  // Prompt says: getMaterialPDF generates signed URL.
  // Input to summarizer needs "fileUrl".
  // If we are server-side reading, we might need a signed URL or direct download.
  // For now let's return the path.
  
  return {
    path: data.path,
    fileName: fileName,
  };
}

export async function getMaterialPDFUrl(path: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase.storage
    .from("materials")
    .createSignedUrl(path, 3600); // 1 hour

  if (error) {
    throw new Error(`Get URL failed: ${error.message}`);
  }

  return data.signedUrl;
}
