import express from 'express';
import { getAllUsers } from './controller.ts';
import { authenticateToken } from '../../auth/middleware/index.ts';

const router = express.Router();

// GET - Get all users
router.get('/', authenticateToken, getAllUsers);

export default router; 
