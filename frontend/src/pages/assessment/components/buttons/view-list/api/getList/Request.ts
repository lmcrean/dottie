import { apiClient } from '../../../../../../../api/core/apiClient';
import { Assessment } from '../../../../../api/types';
import axios from 'axios';

/**
 * Get list of all assessments for the current user
 * @endpoint /api/assessment/list (GET)
 */
export const getList = async (): Promise<Assessment[]> => {
  try {
    // Try the correct endpoint - it's likely one of these:
    const response = await apiClient.get('/api/assessment/list');
    return response.data;
  } catch (error) {
    // Only log non-404 errors, as 404 is expected when no assessments exist
    if (!(axios.isAxiosError(error) && error.response?.status === 404)) {
      console.error('Failed to get assessments:', error);
    }

    // If the error is a 404 (Not Found), return an empty array instead of throwing
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export default getList;
