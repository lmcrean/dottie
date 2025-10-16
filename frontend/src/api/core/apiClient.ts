import axios from 'axios';
import { getAuthToken, setAuthToken, setRefreshToken } from './tokenManager';
import { getBaseUrl, setApiBaseUrl, logBaseUrlConfig } from './getBaseUrl';
import { setupRequestInterceptor, setupResponseInterceptor } from './interceptors';

/**
 * Main axios instance for making API requests
 * This instance has all the common configurations and interceptors
 */

// Get and log the base URL
const baseUrl = getBaseUrl();
logBaseUrlConfig(baseUrl);

// Create the axios instance
const apiClient = axios.create({
  baseURL: baseUrl,
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

// Setup interceptors
setupRequestInterceptor(apiClient);
setupResponseInterceptor(apiClient);

// Update the setApiBaseUrl function to also update the client
const updateApiBaseUrl = (url: string) => {
  const newUrl = setApiBaseUrl(url);
  apiClient.defaults.baseURL = newUrl;
  return newUrl;
};

export { apiClient, setAuthToken, setRefreshToken, updateApiBaseUrl as setApiBaseUrl };
