import express from 'express';
import databaseRoutes from '';
import healthRoutes from '';
import errorHandlers from '';

const router = express.Router();

// Mount routes
router.use('/database', databaseRoutes);
router.use('/health', healthRoutes);

// Error handlers should be last
router.use(errorHandlers);

export default router; 
