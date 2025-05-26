import express from 'express';
import { getCurrentUser } from '';
import { authenticateToken } from '';

const router = express.Router();

// GET - Get current user's profile
router.get('/me', authenticateToken, getCurrentUser);

export default router;

