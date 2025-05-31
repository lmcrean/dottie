import express from 'express';
import { createTables } from '../../../db/migrations/initialSchema.js';
import db from '../../../db/database.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log('Starting database initialization...');
    
    await createTables(db);
    
    // Verify healthcheck table has data
    const healthcheckResult = await db('healthcheck').limit(1);
    
    if (!healthcheckResult || healthcheckResult.length === 0) {
      // If still empty, manually insert a record
      await db('healthcheck').insert({});
      console.log('Manually inserted healthcheck record');
    }
    
    console.log('Database initialization completed successfully');
    
    return res.json({
      status: 'success',
      message: 'Database initialized successfully',
      healthcheckRecords: healthcheckResult.length || 1
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    
    return res.status(500).json({
      status: 'error',
      message: 'Failed to initialize database',
      error: error.message
    });
  }
});

export default router; 