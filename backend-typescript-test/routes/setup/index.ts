import express from 'express';
import databaseRoutes from './database/index.ts';
import healthRoutes from './health/index.ts';
import errorHandlers from './middleware/index.ts';

const router = express.Router();

// Mount routes
router.use('/database', databaseRoutes);
router.use('/health', healthRoutes);

// Error handlers should be last
router.use(errorHandlers);

export default router; 
