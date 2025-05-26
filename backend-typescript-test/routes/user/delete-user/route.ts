import express from 'express';
import { deleteUser } from './controller.ts';
import { authenticateToken } from '../../auth/middleware/index.ts';

const router = express.Router();

// DELETE - Delete user
router.delete('/me', authenticateToken, deleteUser);
// DELETE - Delete user by ID
router.delete('/:id', authenticateToken, deleteUser);

export default router; 
