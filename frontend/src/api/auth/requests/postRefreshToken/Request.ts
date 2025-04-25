import { apiClient } from '../../../core/apiClient';
import { AuthResponse } from '../../types';
import { getAuthToken, setAuthToken } from '../../../core/tokenManager';

/**
 * Refresh authentication token
 * @endpoint /api/auth/refresh (POST)
 */
export const postRefreshToken = async (): Promise<AuthResponse> => {
  try {
    // Get the current token using token manager
    const currentToken = getAuthToken();

    if (!currentToken) {
      throw new Error('No authentication token found');
    }

    const response = await apiClient.post('/api/auth/refresh');

    // Update token using token manager
    if (response.data.token) {
      setAuthToken(response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

export default postRefreshToken;
