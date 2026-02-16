"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getMaterialPDFUrl } from "@/lib/supabase/storage";
import { MaterialSummary } from "@/types/summarizer";
import { extractText } from "unpdf";

/**
 * Downloads a file from a URL and returns a Buffer.
 */
async function downloadFile(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Extracts text from a PDF buffer using unpdf.
 */
async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  const { text } = await extractText(new Uint8Array(pdfBuffer));
  // text is string[] (one per page), join them
  return Array.isArray(text) ? text.join("\n") : String(text);
}

/**
 * Builds the Gemini prompt for summarizing material.
 */
function buildPrompt(
  extractedText: string,
  classLevel: string,
  gradeNumber: number,
  learningMethod: string,
): string {
  return `Kamu adalah seorang ahli pendidikan Indonesia. Analisis materi pelajaran berikut dan buatkan ringkasan serta insight pembelajaran yang detail.

Konteks:
- Tingkat: ${classLevel} Kelas ${gradeNumber}
- Metode Belajar Siswa: ${learningMethod}

Materi yang dianalisis:
---
${extractedText.slice(0, 30000)}
---

Berikan respons dalam format JSON VALID (tanpa markdown code block, langsung JSON saja) dengan struktur PERSIS seperti berikut:

{
  "material": {
    "title": "Judul materi berdasarkan konten",
    "description": "Ringkasan singkat 2-3 kalimat yang menjelaskan inti dari materi ini secara keseluruhan",
    "sections": [
      {
        "title": "Judul Bagian/Topik 1",
        "backgroundColor": "yellow",
        "points": [
          "Poin penting 1 dari bagian ini",
          "Poin penting 2 dari bagian ini",
          "Poin penting 3 dari bagian ini"
        ]
      },
      {
        "title": "Judul Bagian/Topik 2",
        "backgroundColor": "blue",
        "points": [
          "Poin penting 1 dari bagian ini",
          "Poin penting 2 dari bagian ini",
          "Poin penting 3 dari bagian ini"
        ]
      }
    ]
  },
  "insights": {
    "mainTopics": [
      "Topik utama 1",
      "Topik utama 2",
      "Topik utama 3",
      "Topik utama 4",
      "Topik utama 5"
    ],
    "difficultAreas": [
      {
        "title": "Judul bagian yang sulit dipahami",
        "explanation": "Penjelasan mengapa bagian ini sulit dan apa yang perlu diperhatikan"
      },
      {
        "title": "Judul bagian sulit kedua",
        "explanation": "Penjelasan mengapa bagian ini sulit"
      }
    ],
    "teachingRecommendations": [
      {
        "learningStyle": "Nama Gaya Belajar (sesuai metode: ${learningMethod})",
        "methods": [
          "Metode pengajaran spesifik 1 yang sesuai dengan materi ini",
          "Metode pengajaran spesifik 2",
          "Metode pengajaran spesifik 3"
        ],
        "suggestions": [
          "Saran praktis 1 yang bisa langsung diterapkan guru",
          "Saran praktis 2",
          "Saran praktis 3"
        ]
      }
    ]
  }
}

ATURAN PENTING:
1. Buat minimal 2 sections dalam material (gunakan "yellow" dan "blue" secara bergantian untuk backgroundColor)
2. Buat minimal 5 mainTopics berdasarkan isi materi
3. Buat minimal 2 difficultAreas yang relevan dengan materi
4. Buat minimal 1 teachingRecommendations dengan minimal 3 methods dan 3 suggestions
5. Semua konten harus SPESIFIK berdasarkan isi materi yang diberikan, BUKAN generik
6. Gunakan bahasa Indonesia yang mudah dipahami
7. Pastikan JSON valid tanpa trailing comma`;
}

/**
 * Main function: summarizes a material file using Gemini API.
 * Downloads the file from Supabase, extracts text, and calls Gemini.
 */
export async function summarizeWithGemini(
  filePath: string,
  classLevel: string,
  gradeNumber: number,
  learningMethod: string,
): Promise<MaterialSummary> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  // 1. Get signed URL and download the file
  const signedUrl = await getMaterialPDFUrl(filePath);
  const fileBuffer = await downloadFile(signedUrl);

  // 2. Extract text from PDF
  let extractedText: string;
  try {
    extractedText = await extractTextFromPDF(fileBuffer);
  } catch (pdfError) {
    console.error(
      "PDF extraction failed, attempting raw text fallback:",
      pdfError,
    );
    // Fallback: try to read as raw text (for non-PDF files like .pptx)
    extractedText = fileBuffer
      .toString("utf-8")
      .replace(/[^\x20-\x7E\u00A0-\uFFFF\n\r\t]/g, " ");
  }

  if (!extractedText || extractedText.trim().length < 50) {
    throw new Error(
      "Tidak dapat mengekstrak teks dari file. Pastikan file PDF berisi teks yang bisa dibaca (bukan scan/gambar).",
    );
  }

  // 3. Build prompt and call Gemini
  const prompt = buildPrompt(
    extractedText,
    classLevel,
    gradeNumber,
    learningMethod,
  );

  const genAI = new GoogleGenerativeAI(apiKey);

  // gemini-2.5-flash is confirmed working; others as fallback
  const modelsToTry = [
    "gemini-2.5-flash",
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash",
  ];
  const MAX_RETRIES = 3;
  const RATE_LIMIT_DELAY_MS = 35000; // 35s for rate limits
  const PARSE_RETRY_DELAY_MS = 3000; // 3s for parse errors (just retry quickly)

  let lastError: Error | null = null;

  for (const modelName of modelsToTry) {
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 16384, // Increased to prevent truncation
      },
    });

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(
          `[Summarizer] Trying ${modelName}, attempt ${attempt}/${MAX_RETRIES}...`,
        );

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Parse the JSON response
        const cleaned = text
          .replace(/```json\s*/gi, "")
          .replace(/```\s*/g, "")
          .trim();
        const parsed: MaterialSummary = JSON.parse(cleaned);

        // Validate shape
        if (
          !parsed.material?.description ||
          !Array.isArray(parsed.material?.sections) ||
          !Array.isArray(parsed.insights?.mainTopics) ||
          !Array.isArray(parsed.insights?.difficultAreas) ||
          !Array.isArray(parsed.insights?.teachingRecommendations)
        ) {
          throw new Error("Respons AI tidak sesuai format.");
        }

        console.log(
          `[Summarizer] Success with ${modelName} on attempt ${attempt}`,
        );
        return parsed;
      } catch (err: any) {
        lastError = err;
        const is429 =
          err?.message?.includes("429") ||
          err?.message?.includes("Too Many Requests");
        const isParseError =
          err?.message?.includes("JSON") ||
          err?.message?.includes("Unterminated");

        if (is429 && attempt < MAX_RETRIES) {
          console.log(
            `[Summarizer] Rate limited on ${modelName}. Waiting ${RATE_LIMIT_DELAY_MS / 1000}s before retry...`,
          );
          await new Promise((resolve) =>
            setTimeout(resolve, RATE_LIMIT_DELAY_MS),
          );
          continue;
        }

        if (isParseError && attempt < MAX_RETRIES) {
          console.log(
            `[Summarizer] JSON parse error on ${modelName}. Retrying in ${PARSE_RETRY_DELAY_MS / 1000}s...`,
          );
          await new Promise((resolve) =>
            setTimeout(resolve, PARSE_RETRY_DELAY_MS),
          );
          continue;
        }

        // If not retryable or out of retries, try next model
        console.error(`[Summarizer] Failed with ${modelName}: ${err.message}`);
        break;
      }
    }
  }

  throw new Error(
    lastError?.message || "Gagal menganalisis materi. Silakan coba lagi nanti.",
  );
}
