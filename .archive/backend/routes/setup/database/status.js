import express from 'express';
import db, { dbType } from '../../../db/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await db('healthcheck').limit(1);

    if (!Array.isArray(result) || result.length === 0) {
      return res.status(500).json({
        status: 'error',
        message: `Connected to ${dbType}, but 'healthcheck' table is empty or missing.`,
      });
    }

    return res.json({
      status: 'connected',
      database: dbType,
      message: `Successfully connected to ${dbType} database.`,
    });
  } catch (error) {
    console.error('Database connection error:', error);

    return res.status(500).json({
      status: 'error',
      database: dbType,
      message: `Failed to connect to ${dbType} database.`,
      error: error.message,
    });
  }
});

export default router;