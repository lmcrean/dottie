import { apiClient } from '@/src/api/core/apiClient';
import { UserProfile } from '@/src/pages/user/api/types';

/**
 * Update user's email address
 * @endpoint /api/user/me (PUT)
 */
export const updateEmail = async (email: string): Promise<UserProfile> => {
  try {
    const response = await apiClient.put(`/api/user/me`, { email });
    return response.data;
  } catch (error) {
    console.error('Failed to update email:', error);
    throw error;
  }
};

export default updateEmail;
