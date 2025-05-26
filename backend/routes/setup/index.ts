import express from 'express';
// TODO: Fix empty import
// TODO: Fix empty import
// TODO: Fix empty import

const router = express.Router();

// Mount routes
router.use('/database', databaseRoutes);
router.use('/health', healthRoutes);

// Error handlers should be last
router.use(errorHandlers);

export default router; 
