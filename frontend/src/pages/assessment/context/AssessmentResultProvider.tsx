import React, { ReactNode, useEffect } from 'react';
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
import { AgeRange, CycleLength, FlowHeaviness, PainLevel, PeriodDuration } from './types';

// Helper function outside component to avoid JSX parsing issues with generics
function parseJSON<T>(jsonString: string | null, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return jsonString as unknown as T;
  }
}

// Provider component
export function AssessmentResultProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(assessmentResultReducer, initialState);

  // Initialize context from session storage if available
  useEffect(() => {
    // Only initialize if context is empty
    if (!state.result) {
      // Get values from session storage
      const age = sessionStorage.getItem('age') as AgeRange | null;
      const cycle_length = sessionStorage.getItem('cycleLength') as CycleLength | null;
      const period_duration = sessionStorage.getItem('periodDuration') as PeriodDuration | null;
      const flow_heaviness = (sessionStorage.getItem('flowHeaviness') ||
        sessionStorage.getItem('flowLevel')) as FlowHeaviness | null;
      const pain_level = sessionStorage.getItem('painLevel') as PainLevel | null;
      const symptomsStr = sessionStorage.getItem('symptoms');

      // Only initialize if we have at least some data
      if (age || cycle_length || period_duration || flow_heaviness || pain_level || symptomsStr) {
        const symptoms = parseJSON(symptomsStr, []);

        // Update context with session storage data
        dispatch(
          updateResult({
            age: age || undefined,
            cycle_length: cycle_length || undefined,
            period_duration: period_duration || undefined,
            flow_heaviness: flow_heaviness || undefined,
            pain_level: pain_level || undefined,
            physical_symptoms: Array.isArray(symptoms) ? symptoms : [],
            emotional_symptoms: []
          })
        );
      }
    }
  }, []);

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
