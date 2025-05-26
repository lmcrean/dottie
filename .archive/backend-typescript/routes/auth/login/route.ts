import express from 'express';
// TODO: Fix empty import

const router = express.Router();

// User login endpoint
router.post('/', login);

export default router; 
