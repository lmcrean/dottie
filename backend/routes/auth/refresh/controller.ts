import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { refreshTokens } from '../middleware/index.js';
import jwtConfig, { getJWTSecret } from '../../../config/jwt.js';
import { AuthenticatedRequest, AuthUser } from '../../types.js';

interface RefreshRequest {
  refreshToken: string;
}

export const refresh = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Check if refresh token exists in the request
    if (!req.body.refreshToken) {
      res.status(400).json({ error: 'Refresh token is required' });
      return;
    }

    const { refreshToken } = req.body as RefreshRequest;

    // Verify and decode the refresh token first
    let user: AuthUser;
    try {
      user = jwt.verify(refreshToken, jwtConfig.REFRESH_SECRET) as AuthUser;
    } catch (jwtError) {
      // Invalid or expired token
      res.status(401).json({ error: 'Invalid or expired refresh token' });
      return;
    }

    // Check if refresh token exists in our store (using userId for performance)
    const tokenExists = await refreshTokens.has(refreshToken, user.id);
    if (!tokenExists) {
      res.status(401).json({ error: 'Invalid or expired refresh token' });
      return;
    }

    // Generate new access token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        jti: jwtConfig.generateJTI(),
        iat: Math.floor(Date.now() / 1000)
      },
      getJWTSecret(),
      { expiresIn: jwtConfig.TOKEN_EXPIRY.ACCESS_TOKEN } as jwt.SignOptions
    );

    res.json({ token });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
};

export default { refresh };
