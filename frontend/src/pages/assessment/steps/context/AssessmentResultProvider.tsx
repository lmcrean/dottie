import React, { ReactNode } from 'react';
import { AssessmentResultContext } from './AssessmentResultContext';
import { useReducer } from 'react';
import { assessmentResultReducer } from './state/reducer';
import { initialState } from './types';
import {
  setResult,
  updateResult,
  resetResult,
  setPattern,
  setRecommendations
} from './state/actions';

// Provider component
export function AssessmentResultProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(assessmentResultReducer, initialState);

  // Debug current state

  return (
    <AssessmentResultContext.Provider
      value={{
        state,
        setResult: (result) => dispatch(setResult(result)),
        updateResult: (updates) => dispatch(updateResult(updates)),
        resetResult: () => dispatch(resetResult()),
        setPattern: (pattern) => dispatch(setPattern(pattern)),
        setRecommendations: (recommendations) => dispatch(setRecommendations(recommendations))
      }}
    >
      {children}
    </AssessmentResultContext.Provider>
  );
}
