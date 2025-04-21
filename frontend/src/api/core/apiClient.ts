import axios from "axios";
import { getAuthToken, setAuthToken, setRefreshToken } from "./tokenManager";

/**
 * Axios instance for making API requests
 * This instance has all the common configurations and interceptors
 */
// Determine API base URL with fallbacks
const getBaseUrl = () => {
  // First priority: Use environment variable if available
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Second priority: Check for manually configured API URL in localStorage
  const savedApiUrl = localStorage.getItem("api_base_url");
  if (savedApiUrl) {
    return savedApiUrl;
  }

  const isMac = window.navigator.userAgent.includes("Mac");
  const API_PORT = isMac ? 5001 : 5000;
  const hostNameUrl = `http://${window.location.hostname}:${API_PORT}`;

  // Default fallback for local development
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return hostNameUrl;
  }

  // Production fallback: assume API is at the same origin
  return window.location.origin;
};

// Expose a function to update the API URL at runtime
export const setApiBaseUrl = (url: string) => {
  localStorage.setItem("api_base_url", url);
  apiClient.defaults.baseURL = url;
  console.log(`[API Client] Base URL updated to: ${url}`);
  return url;
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Initialize headers from localStorage if available
try {
  const token = getAuthToken();
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log("[API Client] Initialized with token from localStorage");
  } else {
    console.log(
      "[API Client] No token found in localStorage during initialization"
    );
  }
} catch (error) {
  console.error("[API Client] Error accessing localStorage:", error);
}

// Add a request interceptor to always try to include the latest token
apiClient.interceptors.request.use(
  (config) => {
    try {
      // Get token using our token manager
      const token = getAuthToken();

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("[API Client] Added token to request headers");
      } else if (!token) {
        console.warn("[API Client] No auth token available for request to:", config.url);
      }
    } catch (error) {
      console.error("[API Client] Error in request interceptor:", error);
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
      // Server responded with an error status
      console.error(`API Error: ${error.response.status}`, error.response.data);
      
      // Log more details about the error for debugging
      console.error("API Error Details:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });

      // Handle 401 Unauthorized - redirect to login
      if (error.response.status === 401) {
        console.warn("[API Client] Authentication failed - user may need to log in");
        // Remove token and redirect to login
        localStorage.removeItem("authToken");
        // Redirect logic would go here for a real app
      } else if (error.response.status === 400) {
        console.warn("[API Client] Bad request - server rejected the data format");
        // Log the request data for debugging
        try {
          console.error("Request data that caused 400 error:", JSON.parse(error.config.data));
        } catch (e) {
          console.error("Request data (not valid JSON):", error.config.data);
        }
      }
    } else if (error.request) {
      // Request was made but no response received (network error)
      console.error("Network Error:", error.request);
    } else {
      // Something else went wrong
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

// Helper functions to check response status
export const isSuccess = (status: number): boolean =>
  status >= 200 && status < 300;
export const isClientError = (status: number): boolean =>
  status >= 400 && status < 500;
export const isServerError = (status: number): boolean => status >= 500;

export { apiClient, setAuthToken, setRefreshToken };
