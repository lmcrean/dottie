import express from 'express';
import { getAllUsers } from '';
import { authenticateToken } from '';

const router = express.Router();

// GET - Get all users
router.get('/', authenticateToken, getAllUsers);

export default router; 
