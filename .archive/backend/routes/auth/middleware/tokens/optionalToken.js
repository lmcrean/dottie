import jwt from 'jsonwebtoken';

// Environment variables with defaults
const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';

/**
 * Optional token verification
 * Does not require authentication, but attaches user data if token is present and valid
 */
export const optionalToken = (req, res, next) => {
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

    // If no token found, continue without authentication
    if (!token) {
      req.user = null;
      return next();
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      // If token is invalid, continue without authentication
      req.user = null;
    }
    
    next();
  } catch (error) {
    console.error('Optional token verification error:', error);
    req.user = null;
    next();
  }
};

export default {
  optionalToken
}; 