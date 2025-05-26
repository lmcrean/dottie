import express from 'express';
import { refresh } from './controller.ts';

const router = express.Router();

// Refresh token endpoint
router.post('/', refresh);

export default router; 
