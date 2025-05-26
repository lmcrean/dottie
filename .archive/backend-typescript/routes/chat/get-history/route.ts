import express from 'express';
import { authenticateToken } from './controller.js';
// TODO: Fix empty import

const router = express.Router();

// GET /api/chat/history - Get all conversations for the authenticated user
router.get('/', authenticateToken, controller.getHistory);

export default router; 
