import express from 'express';
import { authenticateToken } from '../../auth/middleware/index.ts';
import * as controller from './controller.ts';

const router = express.Router();

// POST /api/chat - Create a new chat conversation
router.post('/', authenticateToken, controller.createChat);

export default router; 
