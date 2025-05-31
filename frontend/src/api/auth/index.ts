import {
  postLogin as originalPostLogin,
  postSignup,
  postLogout,
  postRefreshToken,
  getTokenVerification
} from './requests';
import { LoginInput, SignupInput, AuthResponse } from './types';
import { apiClient } from '../core/apiClient';

// Common function to set the Authorization header
export const setAuthHeader = (token: string) => {
  if (token) {
    // Set the Authorization header for API requests
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Ensure the Authorization header is set when the login succeeds
export const postLogin = async (credentials: LoginInput): Promise<AuthResponse> => {
  const response = await originalPostLogin(credentials);
  
  // Set the Authorization header
  if (response.token) {
    setAuthHeader(response.token);
  }
  
  return response;
};

// Export all auth-related functions
export {
  postSignup,
  postLogout,
  postRefreshToken,
  getTokenVerification
};

// Export types
export * from './types';

// Export schemas
export * from './schemas';

// Auth API object for backward compatibility
export const authApi = {
  login: postLogin,
  signup: postSignup,
  logout: postLogout,
  refreshToken: postRefreshToken,
  verifyToken: getTokenVerification
};

export default authApi;
