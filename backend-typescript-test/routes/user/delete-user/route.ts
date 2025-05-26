import express from 'express';
import { deleteUser } from './controller.js';
import { authenticateToken } from '../../auth/middleware/index.js';

const router = express.Router();

// DELETE - Delete user
router.delete('/me', authenticateToken, deleteUser);
// DELETE - Delete user by ID
router.delete('/:id', authenticateToken, deleteUser);

export default router; 