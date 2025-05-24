import { apiClient } from '../../../../../api/core/apiClient';

/**
 * Delete a user by ID
 * @endpoint /api/user/:id (DELETE)
 */
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    // Reafctoring /api/user/${userId}to /api/user/me
    await apiClient.delete(`/api/user/me`);
  } catch (error) {
    console.error(`Failed to delete user with ID ${userId}:`, error);
    throw error;
  }
};

export default deleteUser;
