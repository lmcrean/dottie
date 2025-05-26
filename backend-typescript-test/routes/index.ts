import express from 'express';
import authRoutes from '';
import assessmentRoutes from '';
import userRoutes from '';
import setupRoutes from '';
import chatRoutes from '';const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/assessment', assessmentRoutes);
router.use('/user', userRoutes);
router.use('/setup', setupRoutes);
router.use('/chat', chatRoutes)

export default router; 
