import express from 'express';
import { authenticateToken } from '../../auth/middleware/index.ts';
import * as controller from './controller.ts';

const router = express.Router();

// POST /api/chat/send - Send a message to the AI and get a response
router.post('/', authenticateToken, controller.sendMessage);

export default router; 
