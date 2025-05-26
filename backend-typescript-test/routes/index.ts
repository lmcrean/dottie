import express from 'express';
import authRoutes from './auth/index.ts';
import assessmentRoutes from './assessment/index.ts';
import userRoutes from './user/index.ts';
import setupRoutes from './setup/index.ts';
import chatRoutes from './chat/index.ts';const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/assessment', assessmentRoutes);
router.use('/user', userRoutes);
router.use('/setup', setupRoutes);
router.use('/chat', chatRoutes)

export default router; 
