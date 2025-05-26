import express from 'express';
import { authenticateToken } from './controller.js';
// TODO: Fix empty import

const router = express.Router();

// POST /api/chat/:chatId/message - Send a follow-up message to a specific chat
router.post('/:chatId/message', authenticateToken, controller.sendFollowUpMessage);

export default router; 
