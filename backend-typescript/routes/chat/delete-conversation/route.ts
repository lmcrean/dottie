import express from 'express';
import { authenticateToken } from '';
import * as controller from '';

const router = express.Router();

// DELETE /api/chat/history/:conversationId - Delete a specific conversation
router.delete('/:conversationId', authenticateToken, controller.deleteConversation);

export default router; 
