import { AssessmentResult, MenstrualPattern } from '@/src/pages/assessment/steps/context/types';
import { determinePattern } from '@/src/pages/assessment/steps/7-calculate-pattern/determinePattern';

/**
 * Validates if a pattern exists, and if not, calculates it based on assessment data
 * @param data - The assessment data from context
 * @returns The assessment data with a valid pattern field
 */
export function calculatePattern(data: AssessmentResult): MenstrualPattern {
  // Return existing pattern if it's valid
  if (
    data.pattern &&
    ['regular', 'irregular', 'heavy', 'pain', 'developing'].includes(data.pattern)
  ) {
    return data.pattern;
  }

  // Use the determinePattern function from the dedicated file
  return determinePattern(data);
}

/**
 * Validates and prepares assessment data before sending to the API
 * Ensures all required fields exist and have valid values
 * @param data - The assessment result from context
 * @returns A validated assessment object ready for API submission
 */
export function prepareAssessmentData(data: AssessmentResult): AssessmentResult {
  if (!data) {
    throw new Error('Assessment data is required');
  }

  // Calculate pattern if not already set
  const pattern = calculatePattern(data);

  // Return a new object with all fields properly set
  return {
    ...data, // Keep original data
    physical_symptoms: data.physical_symptoms || [],
    emotional_symptoms: data.emotional_symptoms || [],
    other_symptoms: data.other_symptoms || '',
    pattern, // Always set the pattern
    recommendations: data.recommendations || []
  };
}

export default prepareAssessmentData;
