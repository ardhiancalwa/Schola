export type ClassLevel = 'SD' | 'SMP' | 'SMA' | 'SMK';

export type LearningMethod = 
  | 'visual' | 'auditory' | 'read_write' | 'logical' | 'social' | 'creative' | 'tech_based';

export const LEARNING_METHOD_LABELS: Record<LearningMethod, string> = {
  visual: 'Visual',
  auditory: 'Auditory',
  read_write: 'Read/Write',
  logical: 'Logical',
  social: 'Social',
  creative: 'Creative',
  tech_based: 'Tech Based'
};

export function isLearningMethod(value: unknown): value is LearningMethod {
  const validMethods: LearningMethod[] = ['visual', 'auditory', 'read_write', 'logical', 'social', 'creative', 'tech_based'];
  return typeof value === 'string' && validMethods.includes(value as LearningMethod);
}

export function getLearningMethodLabelSafe(method: string | LearningMethod): string {
  if (isLearningMethod(method)) {
    return LEARNING_METHOD_LABELS[method];
  }
  return method; // Fallback to raw string if invalid
}

export interface MaterialSection {
  title: string;
  backgroundColor: 'yellow' | 'blue' | 'green';
  points: string[];
}

export interface DifficultArea {
  title: string;
  explanation: string;
}

export interface TeachingRecommendation {
  learningStyle: string;
  methods: string[];
  suggestions: string[];
}

export interface MaterialSummary {
  material: {
    title: string;
    description: string;
    sections: MaterialSection[];
  };
  insights: {
    mainTopics: string[];
    difficultAreas: DifficultArea[];
    teachingRecommendations: TeachingRecommendation[];
  };
}

export interface MaterialAnalysisRecord {
  id: string;
  class_id: string;
  material_id: string; // generated or file id home
  file_name: string;
  file_path: string;
  class_level: ClassLevel;
  grade_number: number;
  learning_method: LearningMethod;
  summary: MaterialSummary;
  created_at: string;
}
