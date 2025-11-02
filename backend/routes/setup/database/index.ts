import express, { Request, Response } from 'express';
import statusRouter from './status.js';
import helloRouter from './hello.js';
// import crudRouter from './crud.js'; // Disabled - Supabase-specific, no longer needed after Neon migration
import initRouter from './init.js';

const router = express.Router();

// Use explicit path for status endpoint
router.use('/status', statusRouter);
router.use('/hello', helloRouter);
// router.use('/crud', crudRouter); // Disabled - Supabase-specific
router.use('/init', initRouter);

// Add root route to redirect to status
router.get('/', (req: Request, res: Response) => {
  res.redirect('/api/setup/database/status');
});

export default router;
