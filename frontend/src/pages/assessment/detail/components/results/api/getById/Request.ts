import { apiClient } from '../../../../../../../api/core/apiClient';
import { Assessment } from '../../../../../api/types';
import { getUserData } from '../../../../../../../api/core/tokenManager';
import { determinePattern } from '../../../../../../assessment/steps/7-calculate-pattern/determinePattern';

/**
 * Get assessment by ID
 * @endpoint /api/assessment/:id (GET)
 */
export const getById = async (id: string): Promise<Assessment> => {
  try {
    // Get the user data from token manager
    const userData = getUserData();
    if (!userData || !userData.id) {
      throw new Error('User ID not found. Please login again.');
    }

    console.log(`Fetching assessment details for ID: ${id}`);
    const response = await apiClient.get(`/api/assessment/${id}`);

    // Process the data to ensure all fields are correctly formatted
    const data = response.data;
    console.log('Assessment raw data from API:', JSON.stringify(data, null, 2));

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
        : 'missing'
    });

    // Ensure the data has the expected fields
    if (!data) {
      throw new Error('No assessment data returned from API');
    }

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
      data.recommendations = data.recommendations ? [data.recommendations] : [];
    }

    // Calculate pattern if it's missing or "unknown"
    if (!data.pattern || data.pattern === 'unknown') {
      console.warn('Pattern not found or unknown in assessment data, recalculating');
      try {
        // Try to determine pattern based on available data
        data.pattern = determinePattern(data);
        console.log('Recalculated pattern:', data.pattern);
      } catch (error) {
        console.error('Failed to recalculate pattern:', error);
        data.pattern = 'unknown';
      }
    }

    console.log('Processed assessment data:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Failed to get assessment:', error);
    throw error;
  }
};

export default getById;
