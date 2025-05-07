// Types for assessment result
export type AgeRange = 'under-13' | '13-17' | '18-24' | '25-plus';
export type CycleLength =
  | 'less-than-21'
  | '21-25'
  | '26-30'
  | '31-35'
  | '36-40'
  | 'irregular'
  | 'not-sure'
  | 'other';
export type PeriodDuration = '1-3' | '4-5' | '6-7' | '8-plus' | 'varies' | 'not-sure' | 'other';
export type FlowHeaviness = 'light' | 'moderate' | 'heavy' | 'very-heavy' | 'varies' | 'not-sure';
export type PainLevel = 'no-pain' | 'mild' | 'moderate' | 'severe' | 'debilitating' | 'varies';

export type MenstrualPattern = 'regular' | 'irregular' | 'heavy' | 'pain' | 'developing';

export interface Recommendation {
  title: string;
  description: string;
}

export interface AssessmentResult {
  age: AgeRange;
  cycle_length: CycleLength;
  period_duration: PeriodDuration;
  flow_heaviness: FlowHeaviness;
  pain_level: PainLevel;
  physical_symptoms: string[];
  emotional_symptoms: string[];
  pattern?: MenstrualPattern;
  recommendations?: Recommendation[];
}

export interface AssessmentResultState {
  result: AssessmentResult | null;
  isComplete: boolean;
}

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
