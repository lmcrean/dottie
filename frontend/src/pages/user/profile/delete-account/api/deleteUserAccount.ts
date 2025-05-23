import { apiClient } from '@/src/api/core/apiClient';

/**
 * Delete the current user's account
 * @endpoint /api/user/me (DELETE)
 */
export const deleteUserAccount = async (): Promise<void> => {
  try {
    // Using /api/user/me for current user deletion
    await apiClient.delete(`/api/user/me`);
  } catch (error) {
    console.error(`Failed to delete user account:`, error);
    throw error;
  }
};

export default deleteUserAccount;
