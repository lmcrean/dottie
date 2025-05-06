import { ReactNode, createContext, useCallback, useContext, useReducer } from 'react';
import React from 'react';
import { determinePattern } from '../services/assessment/determinePattern';
import { generateRecommendations } from '../services/assessment/generateRecommendations';
import { transformToFlattenedFormat } from '../services/assessment/transformToFlattenedFormat';

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

export type MenstrualPattern = 'regular' | 'irregular' | 'heavy' | 'pain' | 'developing';

export interface Recommendation {
  title: string;
  description: string;
}

export interface Symptoms {
  physical: string[];
  emotional: string[];
}

export interface AssessmentResult {
  age: AgeRange;
  cycleLength: CycleLength;
  periodDuration: PeriodDuration;
  flowHeaviness: FlowHeaviness;
  painLevel: PainLevel;
  symptoms: Symptoms;
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

// Context and Provider
export interface AssessmentResultContextType {
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

// Initial state
export const initialState: AssessmentResultState = {
  result: null,
  isComplete: false
};

// Reducer
export function assessmentResultReducer(
  state: AssessmentResultState,
  action: AssessmentResultAction
): AssessmentResultState {
  switch (action.type) {
    case 'SET_RESULT':
      return {
        ...state,
        result: action.payload,
        isComplete: true
      };
    case 'UPDATE_RESULT':
      return {
        ...state,
        result: state.result ? { ...state.result, ...action.payload } : null
      };
    case 'RESET_RESULT':
      return initialState;
    case 'SET_PATTERN':
      return {
        ...state,
        result: state.result ? { ...state.result, pattern: action.payload } : null
      };
    case 'SET_RECOMMENDATIONS':
      return {
        ...state,
        result: state.result ? { ...state.result, recommendations: action.payload } : null
      };
    default:
      return state;
  }
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

  const contextValue: AssessmentResultContextType = {
    state,
    setResult,
    updateResult,
    resetResult,
    setPattern,
    setRecommendations
  };

  // Using React.createElement instead of JSX since this is a .ts file
  return React.createElement(AssessmentResultContext.Provider, { value: contextValue }, children);
}

// Context hook
export function useAssessmentResultContext() {
  const context = useContext(AssessmentResultContext);
  if (context === undefined) {
    throw new Error('useAssessmentResult must be used within an AssessmentResultProvider');
  }
  return context;
}

// Main hook with all functionality
export function useAssessmentResult() {
  const { state, setResult, updateResult, resetResult, setPattern, setRecommendations } =
    useAssessmentResultContext();

  // Function to save assessment result to session storage
  const saveToSessionStorage = useCallback((result: AssessmentResult) => {
    Object.entries(result).forEach(([key, value]) => {
      sessionStorage.setItem(key, JSON.stringify(value));
    });
  }, []);

  // Function to load assessment result from session storage
  const loadFromSessionStorage = useCallback((): Partial<AssessmentResult> => {
    const result: Partial<AssessmentResult> = {};
    const keys: (keyof AssessmentResult)[] = [
      'age',
      'cycleLength',
      'periodDuration',
      'flowHeaviness',
      'painLevel',
      'symptoms',
      'pattern',
      'recommendations'
    ];

    keys.forEach((key) => {
      const value = sessionStorage.getItem(key);
      if (value) {
        result[key] = JSON.parse(value);
      }
    });

    return result;
  }, []);

  // Function to update symptoms
  const updateSymptoms = useCallback(
    (type: keyof Symptoms, symptoms: string[]) => {
      if (!state.result) return;

      const updatedSymptoms: Symptoms = {
        ...state.result.symptoms,
        [type]: symptoms
      };

      updateResult({ symptoms: updatedSymptoms });
    },
    [state.result, updateResult]
  );

  // Function to complete the assessment
  const completeAssessment = useCallback(
    (result: AssessmentResult) => {
      const pattern = determinePattern(result);
      const recommendations = generateRecommendations({ ...result, pattern });

      const completeResult = {
        ...result,
        pattern,
        recommendations
      };

      setResult(completeResult);
      saveToSessionStorage(completeResult);
    },
    [setResult, saveToSessionStorage]
  );

  // Function to clear assessment data
  const clearAssessment = useCallback(() => {
    resetResult();
    sessionStorage.clear();
  }, [resetResult]);

  return {
    ...state,
    setResult,
    updateResult,
    resetResult,
    setPattern,
    setRecommendations,
    determinePattern,
    generateRecommendations,
    saveToSessionStorage,
    loadFromSessionStorage,
    updateSymptoms,
    completeAssessment,
    clearAssessment,
    transformToFlattenedFormat
  };
}
