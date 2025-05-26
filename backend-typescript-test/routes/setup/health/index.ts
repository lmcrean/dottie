import express from 'express';
import helloRouter from './hello.ts';
import serverlessRouter from './serverless.ts';

const router = express.Router();

router.use(helloRouter);
router.use(serverlessRouter);

export default router; 
