import { apiClient, setAuthToken, setRefreshToken } from '../../../core/apiClient';
import { LoginInput, AuthResponse } from '../../types';

/**
 * Login user with credentials
 * @endpoint /api/auth/login (POST)
 */
export const postLogin = async (credentials: LoginInput): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/api/auth/login', credentials);

    // Store auth tokens
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    
    if (response.data.refreshToken) {
      setRefreshToken(response.data.refreshToken);
    }
    
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export default postLogin;
