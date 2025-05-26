import express from 'express';
import { authenticateToken } from '../../auth/middleware/index.js';
import * as controller from './controller.js';

const router = express.Router();

// GET /api/chat/history - Get all conversations for the authenticated user
router.get('/', authenticateToken, controller.getHistory);

export default router; 