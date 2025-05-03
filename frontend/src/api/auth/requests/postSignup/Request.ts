import { apiClient } from '../../../core/apiClient';
import { SignupInput, AuthResponse } from '../../types';

/**
 * Register a new user
 * @endpoint /api/auth/signup (POST)
 */
export const postSignup = async (userData: SignupInput): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/api/auth/signup', userData);

    // Set the token in localStorage for global access
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);

      // Add token to default headers for subsequent requests
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }

    return response.data;
  } catch (error) {
    console.error('Signup failed:', error);
    throw error;
  }
};

export default postSignup;
