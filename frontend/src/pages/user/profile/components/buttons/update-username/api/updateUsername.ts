import { apiClient } from '@/src/api/core/apiClient';
import { UserProfile } from '@/src/pages/user/api/types';

/**
 * Update user's name/username
 * @endpoint /api/user/me (PUT)
 */
export const updateUsername = async (name: string): Promise<UserProfile> => {
  try {
    const response = await apiClient.put(`/api/user/me`, { name });
    return response.data;
  } catch (error) {
    console.error('Failed to update username:', error);
    throw error;
  }
};

export default updateUsername;
