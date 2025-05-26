// Simple script to start the server
import express from 'express';
import supabase from './services/supabaseService.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Add a simple route to test
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Dottie API!' });
});

// Add a health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Add a Supabase test route
app.get('/supabase-test', async (req, res) => {
  try {
    const { data, error } = await supabase.from('healthcheck').select('*').limit(1);
    
    if (error) {
      return res.status(500).json({ 
        status: 'error', 
        message: error.message,
        error
      });
    }
    
    return res.json({ 
      status: 'success', 
      message: 'Successfully connected to Supabase',
      data
    });
  } catch (error) {
    return res.status(500).json({ 
      status: 'error', 
      message: error.message,
      error: String(error)
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Using Supabase database');
}); 