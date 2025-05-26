import express from 'express';
import { logout } from '';
import { authenticateToken } from '';

const router = express.Router();

// User logout endpoint
router.post('/', authenticateToken, logout);

export default router; 
