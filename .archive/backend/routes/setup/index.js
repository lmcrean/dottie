import express from 'express';
import databaseRoutes from './database/index.js';
import healthRoutes from './health/index.js';
import errorHandlers from './middleware/index.js';

const router = express.Router();

// Mount routes
router.use('/database', databaseRoutes);
router.use('/health', healthRoutes);

// Error handlers should be last
router.use(errorHandlers);

export default router; 