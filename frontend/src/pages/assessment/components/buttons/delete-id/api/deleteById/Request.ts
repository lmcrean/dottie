import { apiClient } from '@/src/api/core/apiClient';
import { getUserData } from '@/src/api/core/tokenManager';

/**
 * Delete assessment by ID
 * @endpoint /api/assessment/:userId/:id (DELETE)
 */
export const deleteById = async (id: string): Promise<void> => {
  try {
    const userData = getUserData();
    if (!userData || !userData.id) {
      throw new Error('User ID not found. Please login again.');
    }

    await apiClient.delete(`/api/assessment/${userData.id}/${id}`);
  } catch (error) {
    console.error('Failed to delete assessment:', error);
    throw error;
  }
};

export default deleteById;
