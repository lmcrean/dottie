/**
 * Token Manager - A centralized utility for managing authentication tokens
 * Handles consistent storage and retrieval of auth tokens across the application
 */

import { AuthResponse, User } from '@/src/api/auth';

// Constants for token keys to ensure consistency
export const TOKEN_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'auth_user'
};

// In-memory backup storage in case localStorage is not available
const memoryTokenStorage = {
  [TOKEN_KEYS.AUTH_TOKEN]: null as string | null,
  [TOKEN_KEYS.REFRESH_TOKEN]: null as string | null,
  [TOKEN_KEYS.USER]: null as string | null
};

/**
 * Set authentication token in both localStorage and memory
 */
export const setAuthToken = (token: string): boolean => {
  if (!token) return false;

  try {
    // Store in memory first as backup
    memoryTokenStorage[TOKEN_KEYS.AUTH_TOKEN] = token;

    // Store in localStorage
    localStorage.setItem(TOKEN_KEYS.AUTH_TOKEN, token);

    // Dispatch token change event
    try {
      window.dispatchEvent(new Event('authToken_changed'));
    } catch (e) {
      console.error('[Token Manager] Failed to dispatch token change event:', e);
    }

    return true;
  } catch (e) {
    console.error('[Token Manager] Failed to store auth token:', e);
    return false;
  }
};

/**
 * Set refresh token in both localStorage and memory
 */
export const setRefreshToken = (token: string): boolean => {
  if (!token) return false;

  try {
    // Store in memory first
    memoryTokenStorage[TOKEN_KEYS.REFRESH_TOKEN] = token;

    // Store in localStorage
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, token);
    return true;
  } catch (e) {
    console.error('[Token Manager] Failed to store refresh token:', e);
    return false;
  }
};

/**
 * Set user data in localStorage and memory
 */
export const setUserData = (user: User): boolean => {
  if (!user) return false;

  try {
    const userJson = JSON.stringify(user);

    // Store in memory
    memoryTokenStorage[TOKEN_KEYS.USER] = userJson;

    // Store in localStorage
    localStorage.setItem(TOKEN_KEYS.USER, userJson);
    return true;
  } catch (e) {
    console.error('[Token Manager] Failed to store user data:', e);
    return false;
  }
};

/**
 * Get auth token from localStorage or memory fallback
 */
export const getAuthToken = (): string | null => {
  try {
    // Try localStorage first
    const token = localStorage.getItem(TOKEN_KEYS.AUTH_TOKEN);

    // If not in localStorage, try memory
    if (!token && memoryTokenStorage[TOKEN_KEYS.AUTH_TOKEN]) {
      return memoryTokenStorage[TOKEN_KEYS.AUTH_TOKEN];
    }

    return token;
  } catch (e) {
    console.error('[Token Manager] Failed to get auth token:', e);
    return memoryTokenStorage[TOKEN_KEYS.AUTH_TOKEN];
  }
};

/**
 * Get refresh token from localStorage or memory fallback
 */
export const getRefreshToken = (): string | null => {
  try {
    // Try localStorage first
    const token = localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);

    // If not in localStorage, try memory
    if (!token && memoryTokenStorage[TOKEN_KEYS.REFRESH_TOKEN]) {
      return memoryTokenStorage[TOKEN_KEYS.REFRESH_TOKEN];
    }

    return token;
  } catch (e) {
    console.error('[Token Manager] Failed to get refresh token:', e);
    return memoryTokenStorage[TOKEN_KEYS.REFRESH_TOKEN];
  }
};

/**
 * Get user data from localStorage or memory fallback
 */
export const getUserData = () => {
  try {
    // Try localStorage first
    const userJson = localStorage.getItem(TOKEN_KEYS.USER);

    if (userJson) {
      return JSON.parse(userJson);
    }

    // If not in localStorage, try memory
    if (memoryTokenStorage[TOKEN_KEYS.USER]) {
      return JSON.parse(memoryTokenStorage[TOKEN_KEYS.USER] as string);
    }

    return null;
  } catch (e) {
    console.error('[Token Manager] Failed to get user data:', e);
    return null;
  }
};

/**
 * Check if auth token exists
 */
export const hasAuthToken = (): boolean => {
  return !!getAuthToken();
};

/**
 * Check if refresh token exists
 */
export const hasRefreshToken = (): boolean => {
  return !!getRefreshToken();
};

/**
 * Remove all authentication data (logout)
 */
export const clearAllTokens = (): void => {
  try {
    // Remove from localStorage
    localStorage.removeItem(TOKEN_KEYS.AUTH_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.USER);

    // Clear memory storage
    memoryTokenStorage[TOKEN_KEYS.AUTH_TOKEN] = null;
    memoryTokenStorage[TOKEN_KEYS.REFRESH_TOKEN] = null;
    memoryTokenStorage[TOKEN_KEYS.USER] = null;

    // Dispatch token change event
    try {
      window.dispatchEvent(new Event('authToken_changed'));
    } catch (e) {
      console.error('[Token Manager] Failed to dispatch token change event:', e);
    }
  } catch (e) {
    console.error('[Token Manager] Failed to clear tokens:', e);
  }
};

/**
 * Store complete authentication data from login/signup response
 */
export const storeAuthData = (data: AuthResponse): boolean => {
  if (!data) return false;

  try {
    let success = false;

    // Extract all possible token field names
    const possibleTokenFields = ['token', 'accessToken', 'jwt', 'access_token', 'jwtToken'];
    const possibleRefreshTokenFields = ['refreshToken', 'refresh_token', 'refresh'];

    // Find and store auth token
    for (const field of possibleTokenFields) {
      if (field in data && typeof data[field as keyof AuthResponse] === 'string') {
        setAuthToken(data[field as keyof AuthResponse] as string);
        success = true;
        break;
      }
    }

    // Find and store refresh token
    for (const field of possibleRefreshTokenFields) {
      if (field in data && typeof data[field as keyof AuthResponse] === 'string') {
        setRefreshToken(data[field as keyof AuthResponse] as string);
        break;
      }
    }

    // Store user data if available
    if (data.user) {
      setUserData(data.user);
    }

    return success;
  } catch (e) {
    console.error('[Token Manager] Failed to store auth data:', e);
    return false;
  }
};

// Default export for backward compatibility
export default {
  TOKEN_KEYS,
  setAuthToken,
  getAuthToken,
  setRefreshToken,
  getRefreshToken,
  getUserData,
  setUserData,
  hasAuthToken,
  hasRefreshToken,
  clearAllTokens,
  storeAuthData
};
