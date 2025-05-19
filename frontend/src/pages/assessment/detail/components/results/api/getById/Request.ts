import { apiClient } from '../../../../../../../api/core/apiClient';
import { Assessment } from '../../../../../api/types';
import { getUserData } from '../../../../../../../api/core/tokenManager';

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
    console.log('Assessment raw data:', data);

    // Ensure the data has the expected fields
    if (!data) {
      throw new Error('No assessment data returned from API');
    }

    // Make sure array fields are properly formatted
    if (data.physical_symptoms && !Array.isArray(data.physical_symptoms)) {
      data.physical_symptoms = data.physical_symptoms ? [data.physical_symptoms] : [];
    }

    if (data.emotional_symptoms && !Array.isArray(data.emotional_symptoms)) {
      data.emotional_symptoms = data.emotional_symptoms ? [data.emotional_symptoms] : [];
    }

    if (data.recommendations && !Array.isArray(data.recommendations)) {
      data.recommendations = data.recommendations ? [data.recommendations] : [];
    }

    // Ensure pattern is set if not present
    if (!data.pattern) {
      console.warn('Pattern not found in assessment data, setting to "unknown"');
      data.pattern = 'unknown';
    }

    console.log('Processed assessment data:', data);
    return data;
  } catch (error) {
    console.error('Failed to get assessment:', error);
    throw error;
  }
};

export default getById;
