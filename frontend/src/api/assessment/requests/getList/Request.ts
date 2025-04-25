import { apiClient } from '../../../core/apiClient';
import { Assessment } from '../../types';

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
    console.error('Failed to get assessments:', error);
    throw error;
  }
};

export default getList;
