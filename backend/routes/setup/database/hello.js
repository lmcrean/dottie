import express from 'express';
import supabase from '../../../services/supabaseService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Determine the database type
    const databaseType = 'Supabase';
    
    // Create dynamic message based on the database type
    const message = `Hello World from ${databaseType}!`;
    
    // Get response directly, without a query
    // We could also perform a simple query if needed
    const response = {
      message,
      timestamp: new Date().toISOString(),
      databaseType
    };
    
    return res.json(response);
  } catch (error) {
    console.error("Database query error:", error);
    return res.status(500).json({ 
      error: error.message,
      message: 'Error connecting to Supabase database'
    });
  }
});

export default router; 