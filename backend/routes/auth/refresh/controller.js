import jwt from 'jsonwebtoken';
import { refreshTokens } from '../middleware/index.js';
import crypto from 'crypto';

export const refresh = async (req, res) => {
  try {
    // Check if refresh token exists in the request
    if (!req.body.refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }
    
    const { refreshToken } = req.body;
    
    // Check if refresh token exists in our store
    if (!refreshTokens.has(refreshToken)) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
    
    jwt.verify(refreshToken, process.env.REFRESH_SECRET || 'your-refresh-secret-key', (err, user) => {
      if (err) {
        // Remove invalid token
        refreshTokens.delete(refreshToken);
        return res.status(401).json({ error: 'Invalid or expired refresh token' });
      }
      
      // Generate a truly unique set of identifiers
      const uniqueId = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
      const randomNonce = crypto.randomBytes(16).toString('hex');
      
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          jti: uniqueId,
          nonce: randomNonce,
          iat: Math.floor(Date.now() / 1000)
        },
        process.env.JWT_SECRET || 'dev-jwt-secret',
        { expiresIn: '15m' }
      );
      
      res.json({ token });
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
};

export default { refresh }; 