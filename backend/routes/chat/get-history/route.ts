import express from 'express';
import { authenticateToken } from '';
import * as controller from '';

const router = express.Router();

// GET /api/chat/history - Get all conversations for the authenticated user
router.get('/', authenticateToken, controller.getHistory);

export default router; 
