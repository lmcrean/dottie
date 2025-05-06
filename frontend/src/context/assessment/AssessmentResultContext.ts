import { AssessmentResultContextType } from '@/src/hooks/use-assessment-result';
import { createContext } from 'react';

export const AssessmentResultContext = createContext<AssessmentResultContextType | undefined>(
  undefined
);
