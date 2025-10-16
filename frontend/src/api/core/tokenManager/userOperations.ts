/**
 * User Operations
 * User data storage and retrieval
 */

import { User } from '@/src/api/auth';
import { TOKEN_KEYS } from './constants';
import { setStorageValue, getStorageValue } from './storage';

/**
 * Set user data in localStorage and memory
 */
export const setUserData = (user: User): boolean => {
  if (!user) return false;

  try {
    const userJson = JSON.stringify(user);
    return setStorageValue(TOKEN_KEYS.USER, userJson);
  } catch (e) {
    console.error('[User Operations] Failed to serialize user data:', e);
    return false;
  }
};

/**
 * Get user data from localStorage or memory fallback
 */
export const getUserData = (): User | null => {
  try {
    const userJson = getStorageValue(TOKEN_KEYS.USER);

    if (userJson) {
      return JSON.parse(userJson);
    }

    return null;
  } catch (e) {
    console.error('[User Operations] Failed to parse user data:', e);
    return null;
  }
};
