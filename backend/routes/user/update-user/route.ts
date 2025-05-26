import express from 'express';
import { updateUser } from './controller.js';
// TODO: Fix middleware import: 
// TODO: Fix middleware import: 

const router = express.Router();

// PUT - Update user
router.put('/me', validateUserUpdate, authenticateToken, updateUser);
// PUT - Update user by ID
router.put('/:id', validateUserUpdate, authenticateToken, updateUser);

export default router; 
