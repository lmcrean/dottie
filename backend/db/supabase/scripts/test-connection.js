// Script to test Supabase connection directly
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Testing Supabase connection...');

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_PUBLIC
);

async function testConnection() {
  try {
    // Test authentication API (should always work)
    const authResponse = await supabase.auth.getSession();
    console.log('Auth API response:', authResponse);
    
    // Try to access the healthcheck table
    try {
      const { data, error } = await supabase
        .from('healthcheck')
        .select('*')
        .limit(1);
      
      if (error) {
        console.error('Error accessing healthcheck table:', error);
      } else {
        console.log('Successfully accessed healthcheck table:', data);
      }
    } catch (error) {
      console.error('Exception accessing healthcheck table:', error);
    }
    
    // Print out environment variables (masked)
    console.log('SUPABASE_ANON_PUBLIC:', process.env.SUPABASE_ANON_PUBLIC ? '****' + process.env.SUPABASE_ANON_PUBLIC.slice(-5) : 'not set');
    console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '****' + process.env.SUPABASE_SERVICE_ROLE_KEY.slice(-5) : 'not set');
    
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
  }
}

testConnection(); 