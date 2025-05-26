import express from 'express';
import { authenticateToken } from '../auth/middleware/index.js';
// TODO: Fix empty import

const router = express.Router();

// DELETE /api/chat/history/:conversationId - Delete a specific conversation
router.delete('/:conversationId', authenticateToken, controller.deleteConversation);

export default router; 
