// Types for assessment result
export type AgeRange = 'under-13' | '13-17' | '18-24' | '25-plus';

// Cycle length types based on logic tree decision point
export type CycleLength =
  | 'less-than-21'
  | '21-25'
  | '26-30'
  | '31-35'
  | '36-40'
  | 'irregular'
  | 'not-sure'
  | 'other';

// Period duration types based on logic tree decision point
export type PeriodDuration = '1-3' | '4-5' | '6-7' | '8-plus' | 'varies' | 'not-sure' | 'other';

// Flow heaviness types based on logic tree decision point
export type FlowHeaviness = 'light' | 'moderate' | 'heavy' | 'very-heavy' | 'varies' | 'not-sure';

// Pain level types based on logic tree decision point
export type PainLevel = 'no-pain' | 'mild' | 'moderate' | 'severe' | 'debilitating' | 'varies';

// Pattern types based on logic tree outcomes
export type MenstrualPattern = 'regular' | 'irregular' | 'heavy' | 'pain' | 'developing';

// Simple recommendation interface
export interface Recommendation {
  id: string;
  title: string;
  description: string;
}

// Physical symptom types
export type PhysicalSymptomId =
  | 'bloating'
  | 'breast-tenderness'
  | 'headaches'
  | 'back-pain'
  | 'nausea'
  | 'fatigue'
  | 'dizziness'
  | 'acne'
  | 'digestive-issues'
  | 'sleep-disturbances'
  | 'hot-flashes'
  | 'joint-pain';

// Emotional symptom types
export type EmotionalSymptomId =
  | 'irritability'
  | 'mood-swings'
  | 'anxiety'
  | 'depression'
  | 'difficulty-concentrating'
  | 'food-cravings'
  | 'emotional-sensitivity'
  | 'low-energy';

// Main assessment result interface
export interface AssessmentResult {
  age?: AgeRange;
  cycle_length?: CycleLength;
  period_duration?: PeriodDuration;
  flow_heaviness?: FlowHeaviness;
  pain_level?: PainLevel;
  physical_symptoms: PhysicalSymptomId[];
  emotional_symptoms: EmotionalSymptomId[];
  other_symptoms?: string;
  pattern?: MenstrualPattern;
  recommendations?: Recommendation[];
}

// Assessment state interface
export interface AssessmentResultState {
  result: AssessmentResult | null;
  isComplete: boolean;
}

// Assessment action types
export type AssessmentResultAction =
  | { type: 'SET_RESULT'; payload: AssessmentResult }
  | { type: 'UPDATE_RESULT'; payload: Partial<AssessmentResult> }
  | { type: 'RESET_RESULT' }
  | { type: 'SET_PATTERN'; payload: MenstrualPattern }
  | { type: 'SET_RECOMMENDATIONS'; payload: Recommendation[] };

// Initial state
export const initialState: AssessmentResultState = {
  result: null,
  isComplete: false
};
