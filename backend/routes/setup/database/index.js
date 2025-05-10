import express from 'express';
import statusRouter from './status.js';
import helloRouter from './hello.js';
import crudRouter from './crud.js';

const router = express.Router();

// Use explicit path for status endpoint
router.use('/status', statusRouter);
router.use('/hello', helloRouter);
router.use('/crud', crudRouter);

// Add root route to redirect to status
router.get('/', (req, res) => {
  res.redirect('/api/setup/database/status');
});

export default router; 