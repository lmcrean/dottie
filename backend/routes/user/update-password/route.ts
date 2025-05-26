import express from 'express';
import { updatePassword } from '';
import { authenticateToken } from '../auth/middleware/index.js';
import { validateUserAccess } from '';
import { validatePasswordUpdate } from '';

const router = express.Router();

// POST - Update user password with ID param (legacy route, used in some existing clients)
router.post('/pw/update/:id', validatePasswordUpdate, authenticateToken, validateUserAccess, updatePassword);

// POST - Update current user's password using JWT token identity
// This route is used by the frontend and referenced in EndpointRow.tsx
router.post('/pw/update', validatePasswordUpdate, authenticateToken, (req, res, next) => {
  // Set params.id from the authenticated user's ID
  req.params.id = req.user.userId;
  next();
}, updatePassword);

export default router; 
