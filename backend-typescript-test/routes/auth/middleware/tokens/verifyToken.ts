import jwt from 'jsonwebtoken';

// Environment variables with defaults
const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';

/**
 * Middleware to verify JWT token
 * Checks Authorization header for Bearer token or token in cookies
 */
export const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header or cookies
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Extract token from Authorization header
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      // Extract token from cookies
      token = req.cookies.token;
    }

    // If no token found, return unauthorized
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify token format
    if (!/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/.test(token)) {
      return res.status(401).json({ error: 'Invalid token format', code: 'INVALID_TOKEN' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Ensure decoded token has the required fields
      if (!decoded.userId && !decoded.id) {
        return res.status(401).json({ error: 'Invalid token payload', code: 'INVALID_TOKEN' });
      }
      
      // Map userId to id for consistency if needed
      req.user = {
        userId: decoded.userId || decoded.id,
        email: decoded.email
      };
      
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
      } else if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
      }
      return res.status(401).json({ error: 'Authentication failed', code: 'AUTH_FAILED' });
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