import { apiClient } from '../../../core/apiClient';
import { SignupInput, AuthResponse } from '../../types';
// import { API_BASE_URL } from "@/config/api"; // Removed this unused import
import type { AxiosError } from 'axios';
import axios from 'axios';

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
    // More detailed error logging
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error('Error response data:', axiosError.response.data);
        console.error('Error response status:', axiosError.response.status);
        console.error('Error response headers:', axiosError.response.headers);
      }
    }
    throw error;
  }
};

export default postSignup;
