// Script to directly update Supabase schema
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set Supabase URL and service role key
const supabaseUrl = 'https://nooizeyjujtddtxkirof.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vb2l6ZXlqdWp0ZGR0eGtpcm9mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDU2MDcwNywiZXhwIjoyMDYwMTM2NzA3fQ.OTFix5L3nLFlWsc4fLpfg9StIXFfwypIpCqBDeOM57I';

console.log('Running schema update with environment variables:');
console.log(`SUPABASE_URL: ${supabaseUrl}`);
console.log(`SUPABASE_SERVICE_ROLE_KEY: ${supabaseKey.substring(0, 15)}...`);

// Create Supabase client with service role key for admin privileges
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateSchema() {
  try {
    console.log('Starting direct schema update for assessments table...');
    
    // SQL to migrate from assessment_data to assessmentData
    const migrationSQL = `
      -- Check if the assessments table exists
      DO $$
      BEGIN
        IF EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'assessments'
        ) THEN
          -- Check if assessment_data column exists and assessmentData doesn't
          IF EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'assessments' 
            AND column_name = 'assessment_data'
          ) AND NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'assessments' 
            AND column_name = 'assessmentData'
          ) THEN
            -- Create temporary table with new schema
            CREATE TABLE assessments_new (
              id UUID PRIMARY KEY,
              user_id UUID NOT NULL REFERENCES public.users(id),
              "assessmentData" JSONB NOT NULL,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
            
            -- Copy data from old table to new table
            INSERT INTO assessments_new(id, user_id, "assessmentData", created_at, updated_at)
            SELECT id, user_id, assessment_data, created_at, updated_at FROM assessments;
            
            -- Drop old table and rename new one
            DROP TABLE assessments;
            ALTER TABLE assessments_new RENAME TO assessments;
            
            -- Recreate indexes
            CREATE INDEX idx_assessments_user_id ON public.assessments(user_id);
            CREATE INDEX idx_assessments_data_json ON public.assessments USING GIN ("assessmentData");
            
            -- Create the validator function
            CREATE OR REPLACE FUNCTION check_assessmentData_format()
            RETURNS TRIGGER AS $$
            BEGIN
              -- Check if assessmentData is valid JSON
              IF NEW."assessmentData" IS NULL THEN
                RAISE EXCEPTION 'assessmentData cannot be null';
              END IF;
              RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
            
            -- Create the trigger
            DROP TRIGGER IF EXISTS validate_assessmentData ON public.assessments;
            CREATE TRIGGER validate_assessmentData
            BEFORE INSERT OR UPDATE ON public.assessments
            FOR EACH ROW
            EXECUTE FUNCTION check_assessmentData_format();
          ELSE
            RAISE NOTICE 'Either assessmentData column already exists or assessment_data does not exist';
          END IF;
        ELSE
          RAISE NOTICE 'Assessments table does not exist';
        END IF;
      END
      $$;
    `;
    
    // Execute the SQL directly
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      if (error.message.includes('function "exec_sql" does not exist')) {
        console.log('exec_sql function does not exist, trying direct query...');
        
        // Try to use raw query (might not work with service role permissions)
        const { data, error: queryError } = await supabase.auth.admin.queryUser(migrationSQL);
        
        if (queryError) {
          console.error('Direct query failed:', queryError.message);
          
          // Last resort: Display SQL for manual execution
          console.log('\n---------------------------------------------');
          console.log('SQL TO RUN MANUALLY IN SUPABASE DASHBOARD:');
          console.log(migrationSQL);
          console.log('---------------------------------------------\n');
        } else {
          console.log('Schema updated via direct query');
        }
      } else {
        throw new Error(`SQL execution failed: ${error.message}`);
      }
    } else {
      console.log('Schema update completed successfully via exec_sql');
    }
    
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
    
    console.log('Schema update process complete');
  } catch (error) {
    console.error('Error updating schema:', error);
  }
}

// Run the schema update
updateSchema(); 