import { createContext } from 'react';
import { AssessmentResult, AssessmentResultState, MenstrualPattern, Recommendation } from './types';

// Context type
export interface AssessmentResultContextType {
  state: AssessmentResultState;
  setResult: (result: AssessmentResult) => void;
  updateResult: (updates: Partial<AssessmentResult>) => void;
  resetResult: () => void;
  setPattern: (pattern: MenstrualPattern) => void;
  setRecommendations: (recommendations: Recommendation[]) => void;
}

// Create context
export const AssessmentResultContext = createContext<AssessmentResultContextType | undefined>(
  undefined
);
