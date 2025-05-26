import express from 'express';
import { verify } from '';
import { authenticateToken } from '';

const router = express.Router();

// Verify authentication status
router.get('/', authenticateToken, verify);

export default router; 
