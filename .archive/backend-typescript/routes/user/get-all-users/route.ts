import express from 'express';
import { getAllUsers } from './controller.js';
// TODO: Fix middleware import: 

const router = express.Router();

// GET - Get all users
router.get('/', authenticateToken, getAllUsers);

export default router; 
