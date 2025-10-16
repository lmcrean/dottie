import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { refreshTokens } from '../middleware/index.js';
import jwtConfig from '../../../config/jwt.js';

const jwtVerify = promisify(jwt.verify);

export const refresh = async (req, res) => {
  try {
    // Check if refresh token exists in the request
    if (!req.body.refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const { refreshToken } = req.body;

    // Verify and decode the refresh token first
    let user;
    try {
      user = await jwtVerify(refreshToken, jwtConfig.REFRESH_SECRET);
    } catch (jwtError) {
      // Invalid or expired token
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    // Check if refresh token exists in our store (using userId for performance)
    const tokenExists = await refreshTokens.has(refreshToken, user.id);
    if (!tokenExists) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    // Generate new access token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        jti: jwtConfig.generateJTI(),
        iat: Math.floor(Date.now() / 1000)
      },
      jwtConfig.JWT_SECRET,
      { expiresIn: jwtConfig.TOKEN_EXPIRY.ACCESS_TOKEN }
    );

    res.json({ token });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
};

export default { refresh }; 