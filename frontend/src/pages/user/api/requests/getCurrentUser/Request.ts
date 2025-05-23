import { apiClient } from '../../../../../api/core/apiClient';
import { UserProfile } from '../../types';

/**
 * Get the currently authenticated user profile
 * @endpoint /api/user/me (GET)
 */
export const getCurrentUser = async (): Promise<UserProfile> => {
  try {
    const response = await apiClient.get('/api/user/me');
    return response.data;
  } catch (error) {
    console.error('Failed to get current user:', error);
    throw error;
  }
};

export default getCurrentUser;
