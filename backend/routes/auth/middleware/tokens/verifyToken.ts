import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwtConfig from '../../../../config/jwt.js';
import { AuthenticatedRequest, AuthUser } from '../../../types.js';

/**
 * Middleware to verify JWT token
 * Checks Authorization header for Bearer token or token in cookies
 */
export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    // Get token from Authorization header or cookies
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Extract token from Authorization header
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      // Extract token from cookies
      token = req.cookies.token;
    }

    // If no token found, return unauthorized
    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Verify token format
    if (!/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/.test(token)) {
      res.status(401).json({ error: 'Invalid token format', code: 'INVALID_TOKEN' });
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, jwtConfig.JWT_SECRET) as any;

      // Ensure decoded token has the required fields
      if (!decoded.userId && !decoded.id) {
        res.status(401).json({ error: 'Invalid token payload', code: 'INVALID_TOKEN' });
        return;
      }

      // Map userId to id for consistency if needed
      req.user = {
        id: decoded.userId || decoded.id,
        email: decoded.email,
        username: decoded.username
      } as AuthUser;

      next();
    } catch (error: any) {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
        return;
      } else if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
        return;
      }
      res.status(401).json({ error: 'Authentication failed', code: 'AUTH_FAILED' });
      return;
    }
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Alias for verifyToken to maintain compatibility with both naming styles
export const authenticateToken = verifyToken;

export default {
  verifyToken,
  authenticateToken
};
