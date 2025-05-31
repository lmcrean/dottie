import express from 'express';

const router = express.Router();

router.get("/serverless", (req, res) => {
  const now = new Date();
  res.json({ 
    message: "Serverless function is working!",
    timestamp: now.toISOString(),
    environment: {
      node_env: process.env.NODE_ENV || 'not set',
      is_vercel: process.env.VERCEL === '1' ? 'Yes' : 'No',
      region: process.env.VERCEL_REGION || 'unknown'
    }
  });
});

// Add a safe environment variables checker
router.get("/env", (req, res) => {
  res.json({
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    SUPABASE_URL: process.env.SUPABASE_URL ? 'Set' : 'Not set',
    SUPABASE_ANON_PUBLIC: process.env.SUPABASE_ANON_PUBLIC ? 'Set' : 'Not set'
  });
});

export default router; 