import express from 'express';
import { logout } from '';
import { authenticateToken } from '../auth/middleware/index.js';

const router = express.Router();

// User logout endpoint
router.post('/', authenticateToken, logout);

export default router; 
