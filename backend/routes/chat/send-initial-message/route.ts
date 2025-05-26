import express from 'express';
import { authenticateToken } from '../auth/middleware/index.js';
// TODO: Fix empty import

const router = express.Router();

// POST /api/chat/:chatId/message/initial - Send initial message with assessment context
router.post('/:chatId/message/initial', authenticateToken, controller.sendInitialMessage);

export default router; 
