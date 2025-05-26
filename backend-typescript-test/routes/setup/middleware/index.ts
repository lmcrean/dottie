import express from 'express';
import errorHandlers from './errorHandlers.ts';

const router = express.Router();

router.use(errorHandlers);

export default router; 
