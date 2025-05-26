import express from 'express';
import { updateUser } from './controller.js';
import { authenticateToken } from '../../auth/middleware/index.js';
import { validateUserUpdate } from '../../auth/middleware/validators/userValidators.js';

const router = express.Router();

// PUT - Update user
router.put('/me', validateUserUpdate, authenticateToken, updateUser);
// PUT - Update user by ID
router.put('/:id', validateUserUpdate, authenticateToken, updateUser);

export default router; 