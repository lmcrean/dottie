import express from 'express';
import { refresh } from './controller.js';

const router = express.Router();

// Refresh token endpoint
router.post('/', refresh);

export default router; 