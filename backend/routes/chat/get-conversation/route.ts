import express from 'express';
import { authenticateToken } from '../auth/middleware/index.js';
// TODO: Fix empty import

const router = express.Router();

// GET /api/chat/history/:conversationId - Get a specific conversation by ID
router.get('/:conversationId', authenticateToken, controller.getConversation);

export default router; 
