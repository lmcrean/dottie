import express from 'express';
// TODO: Fix empty import
import { authenticateToken } from './controller.js';

const router = express.Router();

// User logout endpoint
router.post('/', authenticateToken, logout);

export default router; 
