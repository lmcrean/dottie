import { Response } from 'express';
import { AuthenticatedRequest } from '../../types.js';

export const verify = (req: AuthenticatedRequest, res: Response): void => {
  // If we get here, authentication was successful via middleware
  res.status(200).json({
    authenticated: true,
    user: {
      id: req.user?.id,
      email: req.user?.email,
      // Add timestamp to show when verification was performed
      verified_at: new Date().toISOString()
    }
  });
};

export default { verify };
