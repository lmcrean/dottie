const jwt = require('jsonwebtoken');

// Simple in-memory storage for refresh tokens
// In production, this should be replaced with a database solution
const refreshTokens = new Set();

// Middleware to verify JWT token
const authenticateToken = async (req, context) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    context.res = {
      status: 401,
      body: { error: 'No token provided' }
    };
    return false;
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-jwt-secret');
    req.user = decoded;
    return true;
  } catch (error) {
    context.res = {
      status: 403,
      body: { error: 'Invalid or expired token' }
    };
    return false;
  }
};

module.exports = {
  refreshTokens,
  authenticateToken
}; 