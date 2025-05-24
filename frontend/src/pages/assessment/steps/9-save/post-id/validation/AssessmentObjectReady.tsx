import { AssessmentResult, MenstrualPattern } from '@/src/pages/assessment/steps/context/types';
import { determinePattern } from '@/src/pages/assessment/steps/7-calculate-pattern/determinePattern';

/**
 * Validates if a pattern exists, and if not, calculates it based on assessment data
 * @param data - The assessment data from context
 * @returns The assessment data with a valid pattern field
 */
export function calculatePattern(data: AssessmentResult): MenstrualPattern {
  console.log('calculatePattern input data:', {
    age: data.age,
    cycle_length: data.cycle_length,
    period_duration: data.period_duration,
    flow_heaviness: data.flow_heaviness,
    pain_level: data.pain_level,
    pattern: data.pattern
  });

  // Return existing pattern if it's valid
  if (
    data.pattern &&
    ['regular', 'irregular', 'heavy', 'pain', 'developing'].includes(data.pattern)
  ) {
    console.log('Using existing valid pattern:', data.pattern);
    return data.pattern;
  }

  // Use the determinePattern function from the dedicated file
  const calculatedPattern = determinePattern(data);
  console.log('Calculated new pattern:', calculatedPattern);
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

  console.log('AssessmentObjectReady - Original data received:', {
    ...safeData,
    physical_symptoms: safeData.physical_symptoms.length,
    emotional_symptoms: safeData.emotional_symptoms.length
  });

  // Calculate pattern if not already set
  const pattern = calculatePattern(safeData);
  console.log('Pattern after calculation:', pattern);

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

  console.log('AssessmentObjectReady - Processed arrays:', {
    physical_symptoms: physical_symptoms.length,
    emotional_symptoms: emotional_symptoms.length,
    recommendations: recommendations.length
  });

  // Return a clean object with all fields properly set
  const result = {
    ...safeData,
    physical_symptoms,
    emotional_symptoms,
    other_symptoms: safeData.other_symptoms || '',
    pattern,
    recommendations
  };

  console.log('AssessmentObjectReady - Final data prepared for API:', {
    ...result,
    physical_symptoms: result.physical_symptoms.length,
    emotional_symptoms: result.emotional_symptoms.length
  });
  return result;
}

export default prepareAssessmentData;
