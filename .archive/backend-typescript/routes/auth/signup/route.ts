import express from 'express';
// TODO: Fix empty import

const router = express.Router();

// User signup endpoint
router.post('/', signup);

export default router; 
