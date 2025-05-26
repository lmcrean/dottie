import express from 'express';
import { authenticateToken } from '../../auth/middleware/index.ts';
import * as controller from './controller.ts';

const router = express.Router();

// GET /api/chat/history - Get all conversations for the authenticated user
router.get('/', authenticateToken, controller.getHistory);

export default router; 
