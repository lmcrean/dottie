import React, { ReactNode } from 'react';
import { AssessmentResultContext } from './AssessmentResultContext';
import {
  AssessmentResult,
  MenstrualPattern,
  Recommendation,
  assessmentResultReducer,
  initialState
} from '@/src/hooks/use-assessment-result';
import { useReducer } from 'react';

// Types
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

export interface Symptoms {
  physical: string[];
  emotional: string[];
}

// Provider component
export function AssessmentResultProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(assessmentResultReducer, initialState);

  const setResult = (result: AssessmentResult) => {
    dispatch({ type: 'SET_RESULT', payload: result });
  };

  const updateResult = (updates: Partial<AssessmentResult>) => {
    dispatch({ type: 'UPDATE_RESULT', payload: updates });
  };

  const resetResult = () => {
    dispatch({ type: 'RESET_RESULT' });
  };

  const setPattern = (pattern: MenstrualPattern) => {
    dispatch({ type: 'SET_PATTERN', payload: pattern });
  };

  const setRecommendations = (recommendations: Recommendation[]) => {
    dispatch({ type: 'SET_RECOMMENDATIONS', payload: recommendations });
  };

  return (
    <AssessmentResultContext.Provider
      value={{
        state,
        setResult,
        updateResult,
        resetResult,
        setPattern,
        setRecommendations
      }}
    >
      {children}
    </AssessmentResultContext.Provider>
  );
}
