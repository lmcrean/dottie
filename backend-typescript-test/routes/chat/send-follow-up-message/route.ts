import express from 'express';
import { authenticateToken } from '../../auth/middleware/index.ts';
import * as controller from './controller.ts';

const router = express.Router();

// POST /api/chat/:chatId/message - Send a follow-up message to a specific chat
router.post('/:chatId/message', authenticateToken, controller.sendFollowUpMessage);

export default router; 
