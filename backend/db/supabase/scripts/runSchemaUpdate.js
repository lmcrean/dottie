// Script to run the assessment schema update on Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Check if environment variables are set
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables');
  process.exit(1);
}

// Create Supabase client with service role key for admin privileges
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateSchema() {
  try {
    console.log('Starting schema update for assessments table...');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '..', 'schema', 'update-assessment-schema.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute the SQL script
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      throw new Error(`SQL execution failed: ${error.message}`);
    }
    
    console.log('Schema update completed successfully');
    
    // Verify table structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('assessments')
      .select('*')
      .limit(0);
      
    if (tableError) {
      console.warn('Warning: Could not verify table structure:', tableError.message);
    } else {
      console.log('Assessments table is accessible');
    }
    
    // Try creating a custom function to execute raw SQL if needed
    console.log('Creating SQL execution function...');
    await supabase.rpc('create_function_execute_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION exec_sql(sql text) RETURNS void AS $$
        BEGIN
          EXECUTE sql;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    }).catch(error => {
      console.warn('Note: Custom SQL execution function creation skipped (might not have permissions):', error.message);
    });
    
    console.log('Schema update process complete');
  } catch (error) {
    console.error('Error updating schema:', error);
    process.exit(1);
  }
}

// Run the schema update
updateSchema(); 