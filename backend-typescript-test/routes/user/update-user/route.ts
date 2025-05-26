import express from 'express';
import { updateUser } from './controller.ts';
import { authenticateToken } from '../../auth/middleware/index.ts';
import { validateUserUpdate } from '../../auth/middleware/validators/userValidators.ts';

const router = express.Router();

// PUT - Update user
router.put('/me', validateUserUpdate, authenticateToken, updateUser);
// PUT - Update user by ID
router.put('/:id', validateUserUpdate, authenticateToken, updateUser);

export default router; 
