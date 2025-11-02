import express, { Request, Response } from 'express';
import db, { dbType } from '../../../db/database.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    // Create dynamic message based on the database type
    const message = `Hello World from ${dbType}!`;

    // Get response directly, without a query
    // We could also perform a simple query if needed
    const result = await db('healthcheck').limit(1);
    const isConnected = result.length > 0;

    const response = {
      message,
      timestamp: new Date().toISOString(),
      dbType,
      isConnected
    };

    return res.json(response);
  } catch (error) {
    console.error("Database query error:", error);
    return res.status(500).json({
      error: (error as Error).message,
      message: `Error connecting to ${dbType} database`,
      dbType,
      isConnected: false
    });
  }
});

export default router;
