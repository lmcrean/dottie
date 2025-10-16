/**
 * Storage Utilities
 * Low-level storage operations with localStorage and memory fallback
 */

import { TOKEN_KEYS } from './constants';
import { MemoryStorage, StorageKey, StorageValue } from './types';

// In-memory backup storage in case localStorage is not available
const memoryTokenStorage: MemoryStorage = {
  [TOKEN_KEYS.AUTH_TOKEN]: null,
  [TOKEN_KEYS.REFRESH_TOKEN]: null,
  [TOKEN_KEYS.USER]: null
};

/**
 * Set value in both localStorage and memory storage
 */
export const setStorageValue = (key: StorageKey, value: string): boolean => {
  if (!key || !value) return false;

  try {
    // Store in memory first as backup
    memoryTokenStorage[key] = value;

    // Store in localStorage
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.error(`[Storage] Failed to store value for key "${key}":`, e);
    return false;
  }
};

/**
 * Get value from localStorage with memory fallback
 */
export const getStorageValue = (key: StorageKey): StorageValue => {
  try {
    // Try localStorage first
    const value = localStorage.getItem(key);

    // If not in localStorage, try memory
    if (!value && memoryTokenStorage[key]) {
      return memoryTokenStorage[key];
    }

    return value;
  } catch (e) {
    console.error(`[Storage] Failed to get value for key "${key}":`, e);
    return memoryTokenStorage[key] || null;
  }
};

/**
 * Remove value from both localStorage and memory
 */
export const removeStorageValue = (key: StorageKey): void => {
  try {
    // Remove from localStorage
    localStorage.removeItem(key);

    // Clear from memory
    memoryTokenStorage[key] = null;
  } catch (e) {
    console.error(`[Storage] Failed to remove value for key "${key}":`, e);
  }
};

/**
 * Clear all token-related storage
 */
export const clearAllStorage = (): void => {
  Object.values(TOKEN_KEYS).forEach((key) => {
    removeStorageValue(key);
  });
};
