import React, { ReactNode } from 'react';
import { AssessmentResultContext } from './AssessmentResultContext';
import { useReducer } from 'react';
import { assessmentResultReducer } from './reducer';
import { AssessmentResult, initialState, MenstrualPattern, Recommendation } from './types';

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
