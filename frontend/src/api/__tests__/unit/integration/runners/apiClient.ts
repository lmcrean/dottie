/**
 * Axios API client configuration for integration tests
 *
 * This module wraps axios with interceptors to automatically handle
 * authentication token management
 */
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000", // Default base URL, can be changed in tests
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Storage for auth token to be used across all API calls
let authToken: string | null = null;

// Interceptor to add auth token to requests
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Add token to Authorization header if available
  if (authToken && config.headers) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

/**
 * Set the authentication token to be used for future requests
 * @param {string} token - Auth token
 */
export function setAuthToken(token: string): void {
  authToken = token;
}

/**
 * Get the current authentication token
 * @returns {string|null} Current auth token
 */
export function getAuthToken(): string | null {
  return authToken;
}

/**
 * Clear the authentication token
 */
export function clearAuthToken(): void {
  authToken = null;
}
