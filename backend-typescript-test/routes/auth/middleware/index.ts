import jwt from 'jsonwebtoken';
import { verifyToken, authenticateToken } from './tokens/verifyToken.ts';
import { optionalToken } from './tokens/optionalToken.ts';

// In-memory storage for refresh tokens
// In production, this would be stored in a database
export const refreshTokens = new Set();

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
