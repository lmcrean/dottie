import { apiClient } from "../../../core/apiClient";
import { clearAllTokens, getRefreshToken } from "../../../core/tokenManager";

/**
 * Logout user and clear all tokens 
 * @endpoint /api/auth/logout (POST)
 */
export const postLogout = async (userId: string = ""): Promise<{ success: boolean }> => {
  const refreshToken = getRefreshToken();
  try {
    const response = await apiClient.post('/api/auth/logout', { refreshToken });
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
    return { success: false };
  }
};

export default postLogout; 