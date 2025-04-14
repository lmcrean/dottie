import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL, // Supabase URL (derived from the anon key)
  process.env.SUPABASE_ANON_PUBLIC
);

export default supabase; 