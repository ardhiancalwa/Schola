import { extractText } from "unpdf";

export async function extractTextFromPDF(pdfUrl: string): Promise<{ text: string; pageCount: number }> {
  try {
    // 1. Fetch PDF from URL
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }
    
    // 2. Convert to ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();
    
    // 3. Extract text using unpdf
    const { text, totalPages } = await extractText(arrayBuffer, { mergePages: true });
    
    // 4. Clean up text
    const cleanText = (text as string)
      .replace(/\s+/g, " ")
      .trim();
    
    return {
      text: cleanText,
      pageCount: totalPages,
    };
  } catch (error: unknown) {
    console.error("PDF Extraction Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to extract text from PDF: ${message}`);
  }
}