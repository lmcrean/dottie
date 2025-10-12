/**
 * Token Operations
 * Authentication and refresh token management
 */

import { TOKEN_KEYS } from './constants';
import { setStorageValue, getStorageValue } from './storage';
import { dispatchTokenChangeEvent } from './eventHandling';

/**
 * Set authentication token in both localStorage and memory
 */
export const setAuthToken = (token: string): boolean => {
  if (!token) return false;

  const success = setStorageValue(TOKEN_KEYS.AUTH_TOKEN, token);

  if (success) {
    dispatchTokenChangeEvent();
  }

  return success;
};

/**
 * Get auth token from localStorage or memory fallback
 */
export const getAuthToken = (): string | null => {
  return getStorageValue(TOKEN_KEYS.AUTH_TOKEN);
};

/**
 * Check if auth token exists
 */
export const hasAuthToken = (): boolean => {
  return !!getAuthToken();
};

/**
 * Set refresh token in both localStorage and memory
 */
export const setRefreshToken = (token: string): boolean => {
  if (!token) return false;

  return setStorageValue(TOKEN_KEYS.REFRESH_TOKEN, token);
};

/**
 * Get refresh token from localStorage or memory fallback
 */
export const getRefreshToken = (): string | null => {
  return getStorageValue(TOKEN_KEYS.REFRESH_TOKEN);
};

/**
 * Check if refresh token exists
 */
export const hasRefreshToken = (): boolean => {
  return !!getRefreshToken();
};
