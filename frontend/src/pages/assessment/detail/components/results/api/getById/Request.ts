import { apiClient } from '../../../../../../../api/core/apiClient';
import { Assessment } from '../../../../../api/types';
import { getUserData } from '../../../../../../../api/core/tokenManager';
import { determinePattern } from '../../../../../../assessment/steps/7-calculate-pattern/determinePattern';
import {
  AssessmentResult,
  AgeRange,
  CycleLength,
  PeriodDuration,
  FlowHeaviness,
  PainLevel,
  PhysicalSymptomId,
  EmotionalSymptomId,
  MenstrualPattern
} from '../../../../../../assessment/steps/context/types';

// Helper function to convert Assessment to AssessmentResult
const convertToAssessmentResult = (assessment: Assessment): AssessmentResult => {
  return {
    age: assessment.age as AgeRange, // Assuming string from API matches AgeRange
    cycle_length: assessment.cycle_length as CycleLength, // Assuming string from API matches CycleLength
    period_duration: assessment.period_duration as PeriodDuration, // Assuming string from API matches PeriodDuration
    flow_heaviness: assessment.flow_heaviness as FlowHeaviness, // Assuming string from API matches FlowHeaviness
    pain_level: assessment.pain_level as PainLevel, // Assuming string from API matches PainLevel
    physical_symptoms: assessment.physical_symptoms as PhysicalSymptomId[], // Assuming strings from API match PhysicalSymptomId
    emotional_symptoms: assessment.emotional_symptoms as EmotionalSymptomId[], // Assuming strings from API match EmotionalSymptomId
    other_symptoms: Array.isArray(assessment.other_symptoms)
      ? assessment.other_symptoms.join(', ')
      : assessment.other_symptoms,
    pattern: assessment.pattern as MenstrualPattern // Assuming string from API matches MenstrualPattern
    // Recommendations are not directly part of AssessmentResult for determinePattern but are part of the broader type
    // We can omit it here or map it if needed elsewhere for AssessmentResult consistency
  };
};

/**
 * Get assessment by ID
 * @endpoint /api/assessment/:id (GET)
 */
export const getById = async (id: string): Promise<Assessment | null> => {
  try {
    // Get the user data from token manager
    const userData = getUserData();
    if (!userData || !userData.id) {
      console.error('[getById] User ID not found or invalid.');
      throw new Error('User ID not found. Please login again.');
    }
    const response = await apiClient.get<Assessment>(`/api/assessment/${id}`);

    const data = response.data;

    if (!data) {
      console.error('[Request.ts/getById] No data in API response.');
      throw new Error('No assessment data returned from API');
    }

    // Initialize arrays if they're missing or not arrays
    if (!data.physical_symptoms) {
      data.physical_symptoms = [];
    } else if (!Array.isArray(data.physical_symptoms)) {
      data.physical_symptoms = data.physical_symptoms ? [data.physical_symptoms] : [];
    }

    if (!data.emotional_symptoms) {
      data.emotional_symptoms = [];
    } else if (!Array.isArray(data.emotional_symptoms)) {
      data.emotional_symptoms = data.emotional_symptoms ? [data.emotional_symptoms] : [];
    }

    if (!data.recommendations) {
      data.recommendations = [];
    } else if (!Array.isArray(data.recommendations)) {
      const recArray = Array.isArray(data.recommendations)
        ? data.recommendations
        : [data.recommendations];
      data.recommendations = recArray.map((rec) =>
        typeof rec === 'object' && rec !== null && 'title' in rec && 'description' in rec
          ? rec
          : { title: String(rec), description: '' }
      ) as Array<{ title: string; description: string }>;
    }

    // Create a combined symptoms array for the UI components
    data.symptoms = [...data.physical_symptoms, ...data.emotional_symptoms];

    // Add other_symptoms to the combined symptoms array if it exists and is not empty
    // Assuming other_symptoms from API is string[] as per Assessment type
    if (
      data.other_symptoms &&
      Array.isArray(data.other_symptoms) &&
      data.other_symptoms.length > 0
    ) {
      data.symptoms.push(...data.other_symptoms);
    }

    // Calculate pattern if it's missing or "unknown"
    if (!data.pattern || data.pattern === 'unknown') {
      console.warn('Pattern not found or unknown in assessment data, recalculating');
      try {
        const assessmentResultInput = convertToAssessmentResult(data);
        data.pattern = determinePattern(assessmentResultInput);
      } catch (error) {
        console.error('Failed to recalculate pattern:', error);
        data.pattern = 'unknown';
      }
    }
    return data;
  } catch (error) {
    console.error('Failed to get assessment:', error);
    throw error;
  }
};

export default getById;
