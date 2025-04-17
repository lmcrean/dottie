import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

// Create a Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Using service role key for full access
);

async function initializeDatabase() {
  console.log('Initializing Supabase database tables...');
  
  try {
    // Create users table
    console.log('Creating users table...');
    const { error: usersError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'users',
      column_definitions: `
        id UUID PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        age INTEGER,
        reset_token TEXT,
        reset_token_expires TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      `
    });
    
    if (usersError) {
      // Fall back to direct SQL if RPC doesn't exist
      console.log('RPC method not available, attempting direct SQL...');
      const { error: directSqlError } = await supabase.from('users').select('count').limit(1);
      
      if (directSqlError && directSqlError.message.includes('does not exist')) {
        console.log('Users table does not exist, creating manually with direct SQL');
        const { error: createError } = await supabase.auth.admin.executeSql(`
          CREATE TABLE IF NOT EXISTS public.users (
            id UUID PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            age INTEGER,
            reset_token TEXT,
            reset_token_expires TIMESTAMP,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `);
        
        if (createError) {
          console.error('Error creating users table with direct SQL:', createError.message);
        } else {
          console.log('Users table created successfully with direct SQL');
        }
      } else {
        console.error('Error with RPC or table already exists:', usersError?.message);
      }
    } else {
      console.log('Users table created successfully');
    }
    
    // Create other tables as needed
    // period_logs, symptoms, conversations, chat_messages, assessments
    // ...

    console.log('Database initialization complete!');
    
    // Check if users table exists
    const { data, error: checkError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (checkError) {
      console.error('Error checking users table:', checkError.message);
    } else {
      console.log('Users table exists and is accessible');
    }
    
  } catch (error) {
    console.error('Unexpected error during initialization:', error);
  }
}

initializeDatabase(); 