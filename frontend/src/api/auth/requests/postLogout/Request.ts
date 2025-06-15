import { apiClient } from '../../../core/apiClient';
import { clearAllTokens, getRefreshToken, getAuthToken } from '../../../core/tokenManager';

/**
 * Logout user and clear all tokens
 * @endpoint /api/auth/logout (POST)
 */
export const postLogout = async (): Promise<{ success: boolean }> => {
  const refreshToken = getRefreshToken();
  const authToken = getAuthToken();
  
  try {
    await apiClient.post('/api/auth/logout', {}, {
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : ''
      }
    });

    // Clear all tokens using the token manager
    clearAllTokens();

    // Clear Authorization header from API client
    if (apiClient.defaults.headers.common['Authorization']) {
      delete apiClient.defaults.headers.common['Authorization'];
    }

    return { success: true };
  } catch (error) {
    console.error('Logout failed:', error);
    // Still clear tokens even if API call fails
    clearAllTokens();
    
    // Clear Authorization header
    if (apiClient.defaults.headers.common['Authorization']) {
      delete apiClient.defaults.headers.common['Authorization'];
    }
    
    throw error;
  }
};

export default postLogout;
