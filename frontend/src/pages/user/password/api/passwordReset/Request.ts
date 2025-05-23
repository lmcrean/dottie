import { apiClient } from '../../../../../api/core/apiClient';
import { PasswordResetRequest, PasswordResetCompletion } from '../../../api/types';

/**
 * Request password reset by email
 * @endpoint /api/user/password/reset (POST)
 */
export const requestPasswordReset = async (
  emailData: PasswordResetRequest
): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post('/api/user/password/reset', emailData);
    return response.data;
  } catch (error) {
    console.error('Failed to request password reset:', error);
    throw error;
  }
};

/**
 * Complete password reset using token and new password
 * @endpoint /api/user/password/reset/complete (POST)
 */
export const completePasswordReset = async (
  resetData: PasswordResetCompletion
): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post('/api/user/password/reset/complete', resetData);
    return response.data;
  } catch (error) {
    console.error('Failed to complete password reset:', error);
    throw error;
  }
};
