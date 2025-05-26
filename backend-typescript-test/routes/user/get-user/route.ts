import express from 'express';
import { getCurrentUser } from './controller.ts';
import { authenticateToken } from '../../auth/middleware/index.ts';

const router = express.Router();

// GET - Get current user's profile
router.get('/me', authenticateToken, getCurrentUser);

export default router;

