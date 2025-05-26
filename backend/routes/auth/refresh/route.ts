import express from 'express';
// TODO: Fix empty import

const router = express.Router();

// Refresh token endpoint
router.post('/', refresh);

export default router; 
