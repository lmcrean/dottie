import express from 'express';
import { authenticateToken } from '../../auth/middleware/index.ts';
import * as controller from './controller.ts';

const router = express.Router();

// DELETE /api/chat/history/:conversationId - Delete a specific conversation
router.delete('/:conversationId', authenticateToken, controller.deleteConversation);

export default router; 
