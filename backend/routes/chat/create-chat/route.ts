import express from 'express';
import { authenticateToken } from '../auth/middleware/index.js';
// TODO: Fix empty import

const router = express.Router();

// POST /api/chat - Create a new chat conversation
router.post('/', authenticateToken, controller.createChat);

export default router; 
