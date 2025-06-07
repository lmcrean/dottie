import express from 'express';
import statusRouter from './status.js';
import helloRouter from './hello.js';
import crudRouter from './crud.js';
import initRouter from './init.js';

const router = express.Router();

// Use explicit path for status endpoint
router.use('/status', statusRouter);
router.use('/hello', helloRouter);
router.use('/crud', crudRouter);
router.use('/init', initRouter);

// Add root route to redirect to status
router.get('/', (req, res) => {
  res.redirect('/api/setup/database/status');
});

export default router; 