import express from 'express';
import { logout } from './controller.ts';
import { authenticateToken } from '../middleware/index.ts';

const router = express.Router();

// User logout endpoint
router.post('/', authenticateToken, logout);

export default router; 
