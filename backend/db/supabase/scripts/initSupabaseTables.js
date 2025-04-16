import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for admin operations
);

// Function to verify connection to Supabase
async function verifyConnection() {
  try {
    console.log('Verifying connection to Supabase...');

    // Try a simple API call that doesn't depend on table existence
    const { error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    console.log('Successfully connected to Supabase!');
    
    // Now try to create a healthcheck table
    try {
      // This might fail if the table doesn't exist yet, which is expected
      await supabase.from('healthcheck').select('count').limit(1);
      console.log('Healthcheck table exists.');
    } catch (tableError) {
      console.log('Healthcheck table does not exist yet. This is expected if running for first time.');
    }

    // Display schema info
    console.log('\nPlease create the following tables in Supabase dashboard:');
    console.log(`
    1. healthcheck table:
       - id: uuid PRIMARY KEY DEFAULT uuid_generate_v4()
       - message: text
       - created_at: timestamp with time zone DEFAULT NOW()
       
    2. users table:
       - id: uuid PRIMARY KEY
       - username: text UNIQUE NOT NULL
       - email: text UNIQUE NOT NULL
       - password_hash: text NOT NULL
       - age: text
       - reset_token: text
       - reset_token_expires: timestamp with time zone
       - created_at: timestamp with time zone DEFAULT NOW()
       - updated_at: timestamp with time zone DEFAULT NOW()
    
    3. period_logs table:
       - id: serial PRIMARY KEY
       - user_id: uuid REFERENCES users(id)
       - start_date: date NOT NULL
       - end_date: date
       - flow_level: integer
       - created_at: timestamp with time zone DEFAULT NOW()
       - updated_at: timestamp with time zone DEFAULT NOW()
    
    4. conversations table:
       - id: uuid PRIMARY KEY DEFAULT uuid_generate_v4()
       - user_id: uuid REFERENCES users(id)
       - title: text
       - created_at: timestamp with time zone DEFAULT NOW()
       - updated_at: timestamp with time zone DEFAULT NOW()
    
    5. chat_messages table:
       - id: uuid PRIMARY KEY DEFAULT uuid_generate_v4()
       - conversation_id: uuid REFERENCES conversations(id)
       - role: text NOT NULL
       - content: text NOT NULL
       - created_at: timestamp with time zone DEFAULT NOW()
    
    6. assessments table:
       - id: uuid or char(36) PRIMARY KEY
       - user_id: text NOT NULL (FK to users.id)
       - assessment_data: text NOT NULL (JSON string of all assessment fields)
       - created_at: timestamp NOT NULL (default now())
       - updated_at: timestamp NOT NULL (auto-updated on change)
    
    7. assessment_data (JSON) structure
       - date: string (ISO format timestamp)
       - pattern: string 
       - age: string 
       - cycleLength: string 
       - periodDuration: string (e.g., "4-5")
       - flowHeaviness: string 
       - painLevel: string 
       - symptoms: object
          - physical: string[] 
          - emotional: string[] 
       - recommendations: array of objects
          - Each object has:
             - title: string
             - description: string
    
    8. temp_test_crud table:
       - id: uuid PRIMARY KEY
       - name: text
       - created_at: timestamp with time zone DEFAULT NOW()
    `);
    
    console.log('\nAfter creating the tables in Supabase, your migration can proceed.');
    
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    process.exit(1);
  }
}

// Run the function
verifyConnection(); 