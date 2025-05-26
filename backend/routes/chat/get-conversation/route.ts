import express from 'express';
import { authenticateToken } from '';
import * as controller from '';

const router = express.Router();

// GET /api/chat/history/:conversationId - Get a specific conversation by ID
router.get('/:conversationId', authenticateToken, controller.getConversation);

export default router; 
