import jwt from 'jsonwebtoken';
import { verifyToken, authenticateToken } from '../types/common';
import { optionalToken } from '../types/common';

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
