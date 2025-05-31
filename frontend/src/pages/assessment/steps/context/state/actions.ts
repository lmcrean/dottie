import { AssessmentResult, MenstrualPattern, Recommendation } from '../types';

export const setResult = (result: AssessmentResult) => ({
  type: 'SET_RESULT' as const,
  payload: result
});

export const updateResult = (updates: Partial<AssessmentResult>) => ({
  type: 'UPDATE_RESULT' as const,
  payload: updates
});

export const resetResult = () => ({
  type: 'RESET_RESULT' as const
});

export const setPattern = (pattern: MenstrualPattern) => ({
  type: 'SET_PATTERN' as const,
  payload: pattern
});

export const setRecommendations = (recommendations: Recommendation[]) => ({
  type: 'SET_RECOMMENDATIONS' as const,
  payload: recommendations
});
