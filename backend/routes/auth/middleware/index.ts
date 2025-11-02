import jwt from 'jsonwebtoken';
import { verifyToken, authenticateToken } from './tokens/verifyToken.js';
import { optionalToken } from './tokens/optionalToken.js';
import refreshTokens from '../../../services/refreshTokenStore.js';

// Export database-backed refresh token storage
export { refreshTokens };

export {
  verifyToken,
  authenticateToken,
  optionalToken
};

export default {
  verifyToken,
  authenticateToken,
  optionalToken,
  refreshTokens
};
