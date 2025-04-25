import { apiClient } from '../../../core/apiClient';
import { Assessment } from '../../types';
import { getUserData } from '../../../core/tokenManager';

/**
 * Update existing assessment
 * @endpoint /api/assessment/:userId/:id (PUT)
 */
export const putUpdate = async (
  id: string,
  assessmentData: Partial<Assessment>
): Promise<Assessment> => {
  try {
    const userData = getUserData();
    if (!userData || !userData.id) {
      throw new Error('User ID not found. Please login again.');
    }

    const response = await apiClient.put(`/api/assessment/${userData.id}/${id}`, assessmentData);
    return response.data;
  } catch (error) {
    console.error('Failed to update assessment:', error);
    throw error;
  }
};

export default putUpdate;
