import { apiClient } from '../../../../../../../api/core/apiClient';
import { Assessment } from '../../../../../api/types';
import { getUserData } from '../../../../../../../api/core/tokenManager';
import { determinePattern } from '../../../../../../assessment/steps/7-calculate-pattern/determinePattern';
import { AssessmentResult } from '../../../../../../assessment/steps/context/types';

/**
 * Get assessment by ID
 * @endpoint /api/assessment/:id (GET)
 */
export const getById = async (id: string): Promise<Assessment | null> => {
  console.log(`[getById] Starting to fetch assessment for ID: ${id}`);
  try {
    // Get the user data from token manager
    const userData = getUserData();
    if (!userData || !userData.id) {
      console.error('[getById] User ID not found or invalid.');
      throw new Error('User ID not found. Please login again.');
    }

    console.log(
      `[getById] User ID ${userData.id} found. Fetching assessment details for ID: ${id}`
    );
    const response = await apiClient.get<Assessment>(`/api/assessment/${id}`);
    console.log('[Request.ts/getById] Raw API response data:', response.data);
    if (response.data && response.data.physical_symptoms) {
      console.log(
        '[Request.ts/getById] physical_symptoms from raw API response:',
        response.data.physical_symptoms
      );
    }

    const data = response.data;

    if (!data) {
      console.error('[Request.ts/getById] No data in API response.');
      throw new Error('No assessment data returned from API');
    }

    console.log(
      '[Request.ts/getById] physical_symptoms before DetailPage processing (which uses ensureArrayFormat):',
      data.physical_symptoms
    );

    // Debug the specific fields needed for pattern calculation
    console.log('Critical fields for pattern calculation:', {
      age: data.age,
      cycle_length: data.cycle_length,
      period_duration: data.period_duration,
      flow_heaviness: data.flow_heaviness,
      pain_level: data.pain_level,
      pattern: data.pattern,
      physical_symptoms: data.physical_symptoms
        ? Array.isArray(data.physical_symptoms)
          ? data.physical_symptoms.length
          : 'not array'
        : 'missing',
      emotional_symptoms: data.emotional_symptoms
        ? Array.isArray(data.emotional_symptoms)
          ? data.emotional_symptoms.length
          : 'not array'
        : 'missing',
      other_symptoms: data.other_symptoms || 'none'
    });

    // Initialize arrays if they're missing or not arrays
    if (!data.physical_symptoms) {
      data.physical_symptoms = [];
    } else if (!Array.isArray(data.physical_symptoms)) {
      console.log('Converting physical_symptoms to array:', data.physical_symptoms);
      data.physical_symptoms = data.physical_symptoms ? [data.physical_symptoms] : [];
    }

    if (!data.emotional_symptoms) {
      data.emotional_symptoms = [];
    } else if (!Array.isArray(data.emotional_symptoms)) {
      console.log('Converting emotional_symptoms to array:', data.emotional_symptoms);
      data.emotional_symptoms = data.emotional_symptoms ? [data.emotional_symptoms] : [];
    }

    if (!data.recommendations) {
      data.recommendations = [];
    } else if (!Array.isArray(data.recommendations)) {
      console.log('Converting recommendations to array:', data.recommendations);
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
      console.log(`Adding other_symptoms to combined array:`, data.other_symptoms);
      data.symptoms.push(...data.other_symptoms);
    }

    console.log('Combined symptoms array created:', data.symptoms);

    // Calculate pattern if it's missing or "unknown"
    if (!data.pattern || data.pattern === 'unknown') {
      console.warn('Pattern not found or unknown in assessment data, recalculating');
      try {
        data.pattern = determinePattern(data as AssessmentResult);
        console.log('Recalculated pattern:', data.pattern);
      } catch (error) {
        console.error('Failed to recalculate pattern:', error);
        data.pattern = 'unknown';
      }
    }

    console.log(
      'Processed assessment data (after ensureArrayFormat and other processing):',
      JSON.stringify(data, null, 2)
    );
    return data;
  } catch (error) {
    console.error('Failed to get assessment:', error);
    throw error;
  }
};

export default getById;
