import express from 'express';
import authRoutes from './auth/index.js';
import assessmentRoutes from './assessment/index.js';
import userRoutes from './user/index.js';
import setupRoutes from './setup/index.js';
import chatRoutes from './chat/index.js'

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/assessment', assessmentRoutes);
router.use('/user', userRoutes);
router.use('/setup', setupRoutes);
router.use('/chat', chatRoutes)

export default router; 