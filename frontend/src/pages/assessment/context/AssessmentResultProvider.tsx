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

  // Debug current state
  console.log('AssessmentResultProvider - Current state:', state);

  // Initialize context from session storage if available
  useEffect(() => {
    console.log('AssessmentResultProvider - Initializing context');

    // Get values from session storage
    const age = sessionStorage.getItem('age') as AgeRange | null;
    const cycle_length = sessionStorage.getItem('cycleLength') as CycleLength | null;
    const period_duration = sessionStorage.getItem('periodDuration') as PeriodDuration | null;
    const flow_heaviness = (sessionStorage.getItem('flowHeaviness') ||
      sessionStorage.getItem('flowLevel')) as FlowHeaviness | null;
    const pain_level = sessionStorage.getItem('painLevel') as PainLevel | null;
    const symptomsStr = sessionStorage.getItem('symptoms');

    console.log('AssessmentResultProvider - Session storage values:', {
      age,
      cycle_length,
      period_duration,
      flow_heaviness,
      pain_level,
      symptoms: symptomsStr
    });

    // Only initialize with session storage data if available
    if (age || cycle_length || period_duration || flow_heaviness || pain_level || symptomsStr) {
      const symptoms = parseJSON(symptomsStr, []);

      console.log('AssessmentResultProvider - Updating with session storage data');
      // Update context with session storage data
      dispatch(
        updateResult({
          age: age ? (age as AgeRange) : undefined,
          cycle_length: cycle_length ? (cycle_length as CycleLength) : undefined,
          period_duration: period_duration ? (period_duration as PeriodDuration) : undefined,
          flow_heaviness: flow_heaviness ? (flow_heaviness as FlowHeaviness) : undefined,
          pain_level: pain_level ? (pain_level as PainLevel) : undefined,
          physical_symptoms: Array.isArray(symptoms) ? symptoms : [],
          emotional_symptoms: []
        })
      );
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
