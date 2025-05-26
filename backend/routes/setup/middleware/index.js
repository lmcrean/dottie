import express from 'express';
import errorHandlers from './errorHandlers.js';

const router = express.Router();

router.use(errorHandlers);

export default router; 