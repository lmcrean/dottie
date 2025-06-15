import { apiClient } from '../../../../../api/core/apiClient';
import { PasswordUpdateRequest } from '../../../api/types';

/**
 * Update user password
 * @endpoint /api/user/pw/update (POST)
 */
export const postPasswordUpdate = async (
  passwordData: PasswordUpdateRequest
): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post('/api/user/pw/update', passwordData);
    return response.data;
  } catch (error) {
    console.error('Failed to update password:', error);
    throw error;
  }
};

export default postPasswordUpdate;
