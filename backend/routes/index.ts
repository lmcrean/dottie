import express from 'express';
import authRoutes from './routes/auth/index.js';
import assessmentRoutes from './routes/assessment/index.js';
import userRoutes from './routes/user/index.js';
import setupRoutes from './routes/setup/index.js';
import chatRoutes from './routes/chat/index.js';const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/assessment', assessmentRoutes);
router.use('/user', userRoutes);
router.use('/setup', setupRoutes);
router.use('/chat', chatRoutes)

export default router; 
