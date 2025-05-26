import express from 'express';
import helloRouter from './hello.js';
import serverlessRouter from './serverless.js';

const router = express.Router();

router.use(helloRouter);
router.use(serverlessRouter);

export default router; 