/**
 * Token Manager - Main Export File
 * Provides a unified API for token management across the application
 */

// Re-export constants
export { TOKEN_KEYS } from './constants';

// Re-export token operations
export {
  setAuthToken,
  getAuthToken,
  hasAuthToken,
  setRefreshToken,
  getRefreshToken,
  hasRefreshToken
} from './tokenOperations';

// Re-export user operations
export { setUserData, getUserData } from './userOperations';

// Re-export auth data operations
export { storeAuthData, clearAllTokens } from './authDataOperations';

// Default export for backward compatibility
import { TOKEN_KEYS } from './constants';
import {
  setAuthToken,
  getAuthToken,
  hasAuthToken,
  setRefreshToken,
  getRefreshToken,
  hasRefreshToken
} from './tokenOperations';
import { setUserData, getUserData } from './userOperations';
import { storeAuthData, clearAllTokens } from './authDataOperations';

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
