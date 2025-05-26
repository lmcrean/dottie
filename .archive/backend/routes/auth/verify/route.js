import express from 'express';
import { verify } from './controller.js';
import { authenticateToken } from '../middleware/index.js';

const router = express.Router();

// Verify authentication status
router.get('/', authenticateToken, verify);

export default router; 