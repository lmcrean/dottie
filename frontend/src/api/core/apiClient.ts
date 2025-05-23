import axios from 'axios';
import { getAuthToken, setAuthToken, setRefreshToken } from './tokenManager';

/**
 * Axios instance for making API requests
 * This instance has all the common configurations and interceptors
 */
// Determine API base URL with fallbacks
const getBaseUrl = () => {
  // First priority: Vercel deployment URL if we're connecting to the deployed backend
  const vercelUrl = 'https://dottie-backend.vercel.app';

  // Second priority: Use environment variable if available
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Second priority: Check for manually configured API URL in localStorage
  const savedApiUrl = localStorage.getItem('api_base_url');
  if (savedApiUrl) {
    return savedApiUrl;
  }

  // Detect E2E mode - if frontend is running on port 3005, use backend port 5005
  const isE2EMode = window.location.port === '3005';
  const isMac = window.navigator.userAgent.includes('Mac');

  let API_PORT;
  if (isE2EMode) {
    API_PORT = 5005; // E2E mode uses port 5005 for backend
  } else {
    API_PORT = isMac ? 5001 : 5000; // Normal development mode
  }

  const hostNameUrl = `http://${window.location.hostname}:${API_PORT}`;

  // Default fallback for local development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return hostNameUrl;
  }

  // Production fallback: use Vercel deployment
  return vercelUrl;
};

// Expose a function to update the API URL at runtime
export const setApiBaseUrl = (url: string) => {
  localStorage.setItem('api_base_url', url);
  apiClient.defaults.baseURL = url;

  return url;
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Initialize headers from localStorage if available
try {
  const token = getAuthToken();
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
} catch (error) {
  console.error('[API Client] Error accessing localStorage:', error);
}

// Add a request interceptor to always try to include the latest token
apiClient.interceptors.request.use(
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

// Add response interceptor for common error handling
apiClient.interceptors.response.use(
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

// Helper functions to check response status
export const isSuccess = (status: number): boolean => status >= 200 && status < 300;
export const isClientError = (status: number): boolean => status >= 400 && status < 500;
export const isServerError = (status: number): boolean => status >= 500;

export { apiClient, setAuthToken, setRefreshToken };
