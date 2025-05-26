import express from 'express';
import { signup } from '';

const router = express.Router();

// User signup endpoint
router.post('/', signup);

export default router; 
