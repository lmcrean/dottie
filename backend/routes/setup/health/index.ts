import express from 'express';
import helloRouter from '';
import serverlessRouter from '';

const router = express.Router();

router.use(helloRouter);
router.use(serverlessRouter);

export default router; 
