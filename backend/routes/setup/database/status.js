import express from 'express';
import supabase from '../../../services/supabaseService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Try to query the database
    const { data, error } = await supabase.from('healthcheck').select('*').limit(1);
    
    if (error) throw error;
    
    return res.json({
      status: 'connected',
      database: 'Supabase',
      message: 'Successfully connected to Supabase database'
    });
  } catch (error) {
    console.error("Database connection error:", error);
    
    return res.status(500).json({
      status: 'error',
      database: 'Supabase',
      message: 'Failed to connect to Supabase database',
      error: error.message
    });
  }
});

export default router; 