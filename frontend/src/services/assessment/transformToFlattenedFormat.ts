import { AssessmentResult } from '../../hooks/use-assessment-result';

/**
 * Transforms assessment result to flattened format for API submission
 * @param result Assessment result data
 * @returns Flattened format matching backend schema
 */
export const transformToFlattenedFormat = (result: AssessmentResult) => {
  // Transform assessment data from camelCase to snake_case and flatten the structure
  return {
    age: result.age,
    pattern: result.pattern || '',
    cycle_length: result.cycleLength,
    period_duration: result.periodDuration,
    flow_heaviness: result.flowHeaviness,
    pain_level: result.painLevel,
    physical_symptoms: result.symptoms.physical,
    emotional_symptoms: result.symptoms.emotional,
    recommendations: result.recommendations || []
  };
};
