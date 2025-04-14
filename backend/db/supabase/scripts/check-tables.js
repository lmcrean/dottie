import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_PUBLIC
);

async function checkTables() {
  console.log('Checking Supabase connection and tables...');
  
  try {
    // Check users table
    console.log('Checking users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (usersError) {
      console.error('Error accessing users table:', usersError.message);
    } else {
      console.log('Users table accessible:', users);
    }
    
    // List all tables in the public schema
    console.log('\nAttempting to list all tables...');
    const { data: tables, error: tablesError } = await supabase
      .rpc('list_tables');
    
    if (tablesError) {
      console.error('Error listing tables:', tablesError.message);
      console.log('Note: You may need to create the list_tables function in Supabase');
    } else {
      console.log('Available tables:', tables);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkTables(); 