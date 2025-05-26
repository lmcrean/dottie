import express from 'express';
import { getCurrentUser } from './controller.js';
import { authenticateToken } from '../../auth/middleware/index.js';

const router = express.Router();

// GET - Get current user's profile
router.get('/me', authenticateToken, getCurrentUser);

export default router;
