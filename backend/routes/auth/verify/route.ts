import express from 'express';
// TODO: Fix empty import
import { authenticateToken } from './controller.js';

const router = express.Router();

// Verify authentication status
router.get('/', authenticateToken, verify);

export default router; 
