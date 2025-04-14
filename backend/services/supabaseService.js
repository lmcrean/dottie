import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables (if .env exists)
try {
  dotenv.config();
} catch (error) {
  console.log('No .env file found, using defaults');
}

// Create a mock Supabase client for local development
const createMockClient = () => {
  console.log('Using mock Supabase client for local development');
  
  // Create a mock client with empty implementation of common methods
  return {
    from: (table) => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: [], error: null }),
      update: () => Promise.resolve({ data: [], error: null }),
      delete: () => Promise.resolve({ data: [], error: null }),
      eq: () => this,
      order: () => this,
      limit: () => this,
      range: () => this
    }),
    auth: {
      signIn: () => Promise.resolve({ user: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: null, error: null, unsubscribe: () => {} })
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        download: () => Promise.resolve({ data: null, error: null }),
        list: () => Promise.resolve({ data: [], error: null })
      })
    }
  };
};

// Determine if we should use a real or mock client
const isLocalDev = process.env.LOCAL_DEV === 'true';
const supabaseUrl = process.env.SUPABASE_URL || 'https://nooizeyjujtddtxkirof.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_PUBLIC;

let supabase;

if (isLocalDev || !supabaseKey) {
  // Use mock client for local development or when key is missing
  supabase = createMockClient();
} else {
  // Use real Supabase client
  supabase = createClient(supabaseUrl, supabaseKey);
}

export default supabase; 