import jwt from 'jsonwebtoken';
import logger from '../services/logger.js';

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        logger.error('Token verification failed:', err);
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
}; 