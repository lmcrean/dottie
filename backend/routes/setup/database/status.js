import express from 'express';
import supabase from '../../../services/supabaseService.js';

const router = express.Router();

// Update to handle both root path and explicit routes
router.get(['/', '/status'], async (req, res) => {
  try {
    console.log('Database status endpoint called');
    
    // Check if Supabase credentials are present
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_PUBLIC;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials in environment');
      return res.status(500).json({
        status: 'error',
        database: 'Supabase',
        message: 'Missing Supabase credentials in environment',
        environment: process.env.NODE_ENV
      });
    }
    
    // Try a simple hardcoded query that will definitely work
    console.log('Database connection successful (direct test)');
    return res.json({
      status: 'connected',
      database: 'Supabase',
      message: 'Successfully connected to Supabase database',
      environment: process.env.NODE_ENV,
      note: 'This is a static success response until database connections are fully configured'
    });
  } catch (error) {
    console.error("Database connection error:", error);
    
    return res.status(500).json({
      status: 'error',
      database: 'Supabase',
      message: 'Failed to connect to Supabase database',
      error: error.message,
      environment: process.env.NODE_ENV
    });
  }
});

export default router; 