import express from 'express';
import { updatePassword } from './controller.js';
import { authenticateToken } from '../../auth/middleware/index.js';
import { validateUserAccess } from '../../auth/middleware/validators/userValidators.js';
import { validatePasswordUpdate } from '../../auth/middleware/validators/passwordValidators.js';
import { AuthenticatedRequest } from '../../types.js';

const router = express.Router();

// POST - Update user password with ID param (legacy route, used in some existing clients)
router.post('/pw/update/:id', validatePasswordUpdate, authenticateToken, validateUserAccess, updatePassword);

// POST - Update current user's password using JWT token identity
// This route is used by the frontend and referenced in EndpointRow.tsx
router.post('/pw/update', validatePasswordUpdate, authenticateToken, (req: AuthenticatedRequest, res, next) => {
  // Set params.id from the authenticated user's ID
  req.params.id = String(req.user?.id);
  next();
}, updatePassword);

export default router;
