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
  const calculatedPattern = determinePattern(data);
  return calculatedPattern;
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

  // Create a safe copy of the data with default values for arrays
  const safeData: AssessmentResult = {
    ...data,
    // Explicitly initialize arrays to prevent null/undefined issues
    physical_symptoms: Array.isArray(data.physical_symptoms) ? [...data.physical_symptoms] : [],
    emotional_symptoms: Array.isArray(data.emotional_symptoms) ? [...data.emotional_symptoms] : []
  };

  // Calculate pattern if not already set
  const pattern = calculatePattern(safeData);

  // Ensure arrays are properly initialized and not null/undefined
  const physical_symptoms = Array.isArray(safeData.physical_symptoms)
    ? [...safeData.physical_symptoms]
    : safeData.physical_symptoms
      ? [safeData.physical_symptoms]
      : [];

  const emotional_symptoms = Array.isArray(safeData.emotional_symptoms)
    ? [...safeData.emotional_symptoms]
    : safeData.emotional_symptoms
      ? [safeData.emotional_symptoms]
      : [];

  const recommendations = Array.isArray(safeData.recommendations)
    ? [...safeData.recommendations]
    : safeData.recommendations
      ? [safeData.recommendations]
      : [];

  // Return a clean object with all fields properly set
  const result = {
    ...safeData,
    physical_symptoms,
    emotional_symptoms,
    other_symptoms: safeData.other_symptoms || '',
    pattern,
    recommendations
  };

  return result;
}

export default prepareAssessmentData;
