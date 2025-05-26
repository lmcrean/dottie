import express from 'express';
import { signup } from './controller.js';

const router = express.Router();

// User signup endpoint
router.post('/', signup);

export default router; 