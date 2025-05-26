import express from 'express';
import { getAllUsers } from './controller.js';
import { authenticateToken } from '../../auth/middleware/index.js';

const router = express.Router();

// GET - Get all users
router.get('/', authenticateToken, getAllUsers);

export default router; 