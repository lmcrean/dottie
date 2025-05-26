import express from 'express';
import { authenticateToken } from '';
import * as controller from '';

const router = express.Router();

// POST /api/chat - Create a new chat conversation
router.post('/', authenticateToken, controller.createChat);

export default router; 
