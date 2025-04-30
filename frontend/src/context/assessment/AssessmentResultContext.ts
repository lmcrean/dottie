import {
  AssessmentResult,
  AssessmentResultState,
  MenstrualPattern,
  Recommendation
} from '@/src/context/assessment/AssessmentResultProvider';
import { createContext } from 'react';

interface AssessmentResultContextType {
  state: AssessmentResultState;
  setResult: (result: AssessmentResult) => void;
  updateResult: (updates: Partial<AssessmentResult>) => void;
  resetResult: () => void;
  setPattern: (pattern: MenstrualPattern) => void;
  setRecommendations: (recommendations: Recommendation[]) => void;
}

export const AssessmentResultContext = createContext<AssessmentResultContextType | undefined>(
  undefined
);
