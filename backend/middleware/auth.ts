import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import logger from '../services/logger.js';
import jwtConfig from '../config/jwt.js';
import { AuthenticatedRequest, AuthUser, ApiError } from '../routes/types.js';

/**
 * Middleware to authenticate JWT tokens
 * Uses promise-based verification for better control flow
 */
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        error: 'Authentication token required',
        code: 'TOKEN_MISSING'
      } as ApiError);
      return;
    }

    try {
      // Verify JWT token
      const user = jwt.verify(token, jwtConfig.JWT_SECRET) as AuthUser;

      // Validate user object
      if (!user || !user.id) {
        logger.error('Invalid user object in token:', user);
        res.status(403).json({
          error: 'Invalid token payload',
          code: 'INVALID_PAYLOAD'
        } as ApiError);
        return;
      }

      // Attach user to request
      req.user = user;

      // Proceed to next middleware
      next();

    } catch (jwtError: any) {
      // Handle specific JWT errors
      if (jwtError.name === 'TokenExpiredError') {
        logger.info('Expired token attempt:', { exp: jwtError.expiredAt });
        res.status(401).json({
          error: 'Token expired',
          code: 'TOKEN_EXPIRED'
        } as ApiError);
        return;
      } else if (jwtError.name === 'JsonWebTokenError') {
        logger.warn('Invalid token format:', jwtError.message);
        res.status(403).json({
          error: 'Invalid token',
          code: 'TOKEN_INVALID'
        } as ApiError);
        return;
      } else {
        logger.error('JWT verification error:', jwtError);
        res.status(403).json({
          error: 'Token verification failed',
          code: 'VERIFICATION_FAILED'
        } as ApiError);
        return;
      }
    }

  } catch (error) {
    // Catch any unexpected errors
    logger.error('Authentication middleware error:', error);
    res.status(500).json({
      error: 'Authentication failed',
      code: 'AUTH_ERROR'
    } as ApiError);
    return;
  }
};
