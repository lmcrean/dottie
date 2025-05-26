import express from 'express';
import { verify } from './controller.ts';
import { authenticateToken } from '../middleware/index.ts';

const router = express.Router();

// Verify authentication status
router.get('/', authenticateToken, verify);

export default router; 
