import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import logger from '../services/logger.js';
import jwtConfig from '../config/jwt.js';

const jwtVerify = promisify(jwt.verify);

/**
 * Middleware to authenticate JWT tokens
 * Uses promise-based verification for better control flow
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Authentication token required',
        code: 'TOKEN_MISSING'
      });
    }

    try {
      // Use promise-based verification for better control flow
      const user = await jwtVerify(token, jwtConfig.JWT_SECRET);

      // Validate user object
      if (!user || !user.id) {
        logger.error('Invalid user object in token:', user);
        return res.status(403).json({
          error: 'Invalid token payload',
          code: 'INVALID_PAYLOAD'
        });
      }

      // Attach user to request
      req.user = user;

      // Proceed to next middleware
      next();

    } catch (jwtError) {
      // Handle specific JWT errors
      if (jwtError.name === 'TokenExpiredError') {
        logger.info('Expired token attempt:', { exp: jwtError.expiredAt });
        return res.status(401).json({
          error: 'Token expired',
          code: 'TOKEN_EXPIRED'
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        logger.warn('Invalid token format:', jwtError.message);
        return res.status(403).json({
          error: 'Invalid token',
          code: 'TOKEN_INVALID'
        });
      } else {
        logger.error('JWT verification error:', jwtError);
        return res.status(403).json({
          error: 'Token verification failed',
          code: 'VERIFICATION_FAILED'
        });
      }
    }

  } catch (error) {
    // Catch any unexpected errors
    logger.error('Authentication middleware error:', error);
    return res.status(500).json({
      error: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
}; 