/**
 * Auth Data Operations
 * Complete authentication response handling and storage
 */

import { AuthResponse } from '@/src/api/auth';
import { setAuthToken, setRefreshToken } from './tokenOperations';
import { setUserData } from './userOperations';
import { clearAllStorage } from './storage';
import { dispatchTokenChangeEvent } from './eventHandling';

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
    console.error('[Auth Data Operations] Failed to store auth data:', e);
    return false;
  }
};

/**
 * Remove all authentication data (logout)
 */
export const clearAllTokens = (): void => {
  clearAllStorage();
  dispatchTokenChangeEvent();
};
