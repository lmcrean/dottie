const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { refreshTokens } = require('../shared/middleware');

module.exports = async function (context, req) {
  context.log('Token refresh function processed a request');

  try {
    // Check if refresh token exists in the request
    if (!req.body || !req.body.refreshToken) {
      context.res = {
        status: 400,
        body: { error: 'Refresh token is required' }
      };
      return;
    }
    
    const { refreshToken } = req.body;
    
    // Check if refresh token exists in our store
    if (!refreshTokens.has(refreshToken)) {
      context.res = {
        status: 401,
        body: { error: 'Invalid or expired refresh token' }
      };
      return;
    }
    
    try {
      const user = jwt.verify(refreshToken, process.env.REFRESH_SECRET || 'your-refresh-secret-key');
      
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
      
      context.res = {
        status: 200,
        body: { token }
      };
    } catch (verifyError) {
      // Remove invalid token
      refreshTokens.delete(refreshToken);
      
      context.res = {
        status: 401,
        body: { error: 'Invalid or expired refresh token' }
      };
      return;
    }
  } catch (error) {
    context.log.error('Refresh token error:', error);
    
    context.res = {
      status: 500,
      body: { error: 'Failed to refresh token' }
    };
  }
}; 