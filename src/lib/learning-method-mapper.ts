import { LearningMethod } from "@/types/summarizer";

/**
 * Valid learning methods as a readonly array for runtime checks
 */
export const VALID_LEARNING_METHODS: readonly LearningMethod[] = [
  'visual', 'auditory', 'read_write', 'logical', 'social', 'creative', 'tech_based'
] as const;

/**
 * Map of common input variations to valid LearningMethod values
 * ✅ UPDATED: Now includes Indonesian UI labels from your form
 */
const METHOD_MAPPINGS: Record<string, LearningMethod> = {
  // ========== VISUAL ==========
  'visual': 'visual',
  'visual learners': 'visual',
  
  // Indonesian UI labels
  'visual (gambar, video, diagram)': 'visual',
  
  // Variations
  'gambar': 'visual',
  'video': 'visual',
  'diagram': 'visual',
  
  // ========== AUDITORY ==========
  'auditory': 'auditory',
  'auditory learners': 'auditory',
  
  // Indonesian UI labels
  'auditori (mendengar & diskusi)': 'auditory',
  'auditori': 'auditory',
  
  // Variations
  'mendengar': 'auditory',
  'diskusi': 'auditory',
  'suara': 'auditory',
  
  // ========== READ/WRITE ==========
  'read_write': 'read_write',
  'read/write': 'read_write',
  'read-write': 'read_write',
  'reading/writing': 'read_write',
  'read & write': 'read_write',
  'read write': 'read_write',
  
  // Indonesian UI labels
  'membaca / menulis': 'read_write',
  'membaca/menulis': 'read_write',
  
  // Variations
  'membaca': 'read_write',
  'menulis': 'read_write',
  
  // ========== LOGICAL ==========
  'logical': 'logical',
  'logical/mathematical': 'logical',
  'logic': 'logical',
  
  // Indonesian UI labels
  'logis / analitis': 'logical',
  'logis/analitis': 'logical',
  
  // Variations
  'logis': 'logical',
  'analitis': 'logical',
  'matematik': 'logical',
  'matematika': 'logical',
  
  // ========== SOCIAL ==========
  'social': 'social',
  'interpersonal': 'social',
  'group': 'social',
  
  // Indonesian UI labels
  'sosial (belajar kelompok)': 'social',
  'sosial': 'social',
  
  // Variations
  'belajar kelompok': 'social',
  'kelompok': 'social',
  
  // ========== CREATIVE ==========
  'creative': 'creative',
  'artistic': 'creative',
  
  // Indonesian UI labels
  'kreatif (seni & storytelling)': 'creative',
  'kreatif': 'creative',
  
  // Variations
  'seni': 'creative',
  'storytelling': 'creative',
  'artistik': 'creative',
  
  // ========== TECH BASED ==========
  'tech_based': 'tech_based',
  'tech-based': 'tech_based',
  'tech based': 'tech_based',
  'technology': 'tech_based',
  'digital': 'tech_based',
  
  // Indonesian UI labels
  'berbasis teknologi': 'tech_based',
  'teknologi': 'tech_based',
};

/**
 * Type guard to check if a string is a valid LearningMethod
 */
export function isValidLearningMethod(input: string): input is LearningMethod {
  return VALID_LEARNING_METHODS.includes(input as LearningMethod);
}

/**
 * Normalizes various input formats to DB-compliant LearningMethod values
 * ✅ UPDATED: Now supports Indonesian UI labels
 * 
 * @param input Raw input string (e.g. "Visual", "Read/Write", "Logis / Analitis")
 * @returns Normalized LearningMethod (e.g. "visual", "read_write", "logical")
 * @throws Error if input is invalid/unknown
 * 
 * @example
 * normalizeLearningMethod('Logis / Analitis') // → 'logical'
 * normalizeLearningMethod('Visual (Gambar, Video, Diagram)') // → 'visual'
 * normalizeLearningMethod('Membaca / Menulis') // → 'read_write'
 */
export function normalizeLearningMethod(input: string | null | undefined): LearningMethod {
  if (!input) {
    throw new Error("Learning method is required");
  }

  // 1. Exact match check (for DB values like 'visual', 'read_write')
  if (isValidLearningMethod(input)) {
    return input;
  }

  // 2. Normalize string (trim + lowercase)
  const normalized = input.toLowerCase().trim();

  // 3. Check direct mapping (handles most cases including Indonesian labels)
  if (METHOD_MAPPINGS[normalized]) {
    return METHOD_MAPPINGS[normalized];
  }

  // 4. ✅ NEW: Strip parentheses and try again
  // "Visual (Gambar, Video, Diagram)" → "Visual"
  const withoutParens = normalized.replace(/\s*\([^)]*\)/g, '').trim();
  if (withoutParens !== normalized && METHOD_MAPPINGS[withoutParens]) {
    return METHOD_MAPPINGS[withoutParens];
  }

  // 5. Fuzzy matching / Fallback Check
  // Handle partial matches or keywords
  
  // Visual keywords
  if (normalized.includes("visual") || normalized.includes("gambar") || normalized.includes("video")) {
    return "visual";
  }
  
  // Auditory keywords
  if (normalized.includes("auditory") || normalized.includes("auditori") || 
      normalized.includes("mendengar") || normalized.includes("diskusi")) {
    return "auditory";
  }
  
  // Read/Write keywords
  if ((normalized.includes("read") && normalized.includes("write")) || 
      (normalized.includes("membaca") || normalized.includes("menulis"))) {
    return "read_write";
  }
  
  // Logical keywords
  if (normalized.includes("logic") || normalized.includes("logis") || 
      normalized.includes("analitis") || normalized.includes("matematik")) {
    return "logical";
  }
  
  // Social keywords
  if (normalized.includes("social") || normalized.includes("sosial") || 
      normalized.includes("group") || normalized.includes("kelompok")) {
    return "social";
  }
  
  // Creative keywords
  if (normalized.includes("creative") || normalized.includes("kreatif") || 
      normalized.includes("artistic") || normalized.includes("seni")) {
    return "creative";
  }
  
  // Tech keywords
  if (normalized.includes("tech") || normalized.includes("teknologi") || 
      normalized.includes("digital") || normalized.includes("berbasis")) {
    return "tech_based";
  }

  // No match found - throw error
  throw new Error(
    `Invalid learning method: '${input}'. Must be one of: ${VALID_LEARNING_METHODS.join(', ')}`
  );
}

/**
 * Safely normalizes learning method with a default fallback
 * @param input Raw input string
 * @param defaultValue Fallback value (default: 'visual')
 */
export function safeLearningMethod(
  input: string | null | undefined, 
  defaultValue: LearningMethod = 'visual'
): LearningMethod {
  try {
    return normalizeLearningMethod(input);
  } catch (err) {
    console.warn(`Learning method normalization failed for '${input}'. Using default '${defaultValue}'.`);
    return defaultValue;
  }
}

/**
 * Extracts learning method from a random object (like ClassData)
 */
export function extractLearningMethod(data: any): LearningMethod {
  if (typeof data === 'string') return safeLearningMethod(data);
  if (data?.learningMethod) return safeLearningMethod(data.learningMethod);
  if (data?.learning_method) return safeLearningMethod(data.learning_method);
  if (data?.method) return safeLearningMethod(data.method);
  if (data?.metode_belajar) return safeLearningMethod(data.metode_belajar);
  
  return 'visual'; // Default
}

/**
 * Display labels for UI (Indonesian)
 */
export const LEARNING_METHOD_LABELS: Record<LearningMethod, string> = {
  visual: 'Visual (Gambar, Video, Diagram)',
  auditory: 'Auditori (Mendengar & Diskusi)',
  read_write: 'Membaca / Menulis',
  logical: 'Logis / Analitis',
  social: 'Sosial (Belajar Kelompok)',
  creative: 'Kreatif (Seni & Storytelling)',
  tech_based: 'Berbasis Teknologi'
};

/**
 * Display labels for UI (English)
 */
export const LEARNING_METHOD_LABELS_EN: Record<LearningMethod, string> = {
  visual: 'Visual',
  auditory: 'Auditory',
  read_write: 'Read/Write',
  logical: 'Logical',
  social: 'Social',
  creative: 'Creative',
  tech_based: 'Technology-Based'
};

/**
 * Get display label safely (type-safe, no errors)
 * @param method Learning method value (can be any string)
 * @param lang Language preference ('id' or 'en')
 * @returns Display label string
 */
export function getLearningMethodLabel(
  method: string | LearningMethod,
  lang: 'id' | 'en' = 'id'
): string {
  // Type guard narrows the type
  if (isValidLearningMethod(method)) {
    return lang === 'id' 
      ? LEARNING_METHOD_LABELS[method]
      : LEARNING_METHOD_LABELS_EN[method];
  }
  
  // Try to normalize first
  try {
    const normalized = normalizeLearningMethod(method);
    return lang === 'id'
      ? LEARNING_METHOD_LABELS[normalized]
      : LEARNING_METHOD_LABELS_EN[normalized];
  } catch {
    return method; // Fallback to input
  }
}