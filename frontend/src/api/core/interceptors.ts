import type { AxiosInstance } from 'axios';
import { getAuthToken } from './tokenManager';

/**
 * Configures request interceptor for authentication
 */
export const setupRequestInterceptor = (client: AxiosInstance): void => {
  client.interceptors.request.use(
    (config) => {
      try {
        // Get token using our token manager
        const token = getAuthToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('[API Client] Error in request interceptor:', error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

/**
 * Configures response interceptor for error handling
 */
export const setupResponseInterceptor = (client: AxiosInstance): void => {
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle common errors here
      if (error.response) {
        // Don't log 404 errors from assessment list endpoint as they're expected when no assessments exist
        const isAssessmentListNotFound =
          error.response.status === 404 && error.config.url?.includes('/api/assessment/list');

        // Only log errors that aren't expected "not found" cases
        if (!isAssessmentListNotFound) {
          console.error(`API Error: ${error.response.status}`, error.response.data);
        }

        // Handle 401 Unauthorized - redirect to login
        if (error.response.status === 401) {
          // Remove token and redirect to login
          localStorage.removeItem('authToken');
          // Redirect logic would go here for a real app
        }
      } else if (error.request) {
        // Request was made but no response received (network error)
        console.error('Network Error:', error.request);
      } else {
        // Something else went wrong
        console.error('Error:', error.message);
      }

      return Promise.reject(error);
    }
  );
};
