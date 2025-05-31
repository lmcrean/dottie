import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Validate required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  process.exit(1);
}

// Create a Supabase client with the service role key for admin privileges
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixSchema() {
  try {
    console.log("Starting schema fix...");

    // Check if the assessments table exists
    let { data: tables, error: tablesError } = await supabase.rpc(
      "get_tables"
    );

    if (tablesError) {
      // If the RPC doesn't exist, try a direct query
      const { data, error } = await supabase.from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public');
      
      if (error) {
        console.error("Error checking tables:", error.message);
        throw error;
      }
      
      tables = data.map(row => row.tablename);
    }



    // First, try to verify if assessments table exists by querying it
    const { data: assessmentCheck, error: assessmentCheckError } = await supabase
      .from("assessments")
      .select("*")
      .limit(1);

    if (assessmentCheckError) {

      
      // If the table doesn't exist, create it
      if (assessmentCheckError.message.includes("relation") && assessmentCheckError.message.includes("does not exist")) {

        
        // Execute raw SQL to create the table
        const { error: createTableError } = await supabase.rpc('exec_sql', {
          sql_query: `
            CREATE TABLE IF NOT EXISTS public.assessments (
              id UUID PRIMARY KEY,
              user_id UUID NOT NULL REFERENCES public.users(id),
              assessment_data JSONB NOT NULL,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
          `
        });
        
        if (createTableError) {
          // If RPC fails, try direct SQL (this might not work depending on permissions)
          console.error("Failed to create table via RPC:", createTableError.message);
          console.log("Manual SQL needed:", `
            CREATE TABLE IF NOT EXISTS public.assessments (
              id UUID PRIMARY KEY,
              user_id UUID NOT NULL REFERENCES public.users(id),
              assessment_data JSONB NOT NULL,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
          `);
        } else {
          console.log("Assessments table created successfully");
        }
      }
    } else {
      console.log("Assessments table already exists");
      
      // Check if user_id column exists in assessments table
      const { data: columnInfo, error: columnError } = await supabase.rpc('get_column_info', {
        table_name: 'assessments',
        column_name: 'user_id'
      });
      
      if (columnError || !columnInfo || columnInfo.length === 0) {

        
        // Add user_id column if it doesn't exist
        const { error: alterTableError } = await supabase.rpc('exec_sql', {
          sql_query: `
            ALTER TABLE public.assessments 
            ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id);
            
            CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
          `
        });
        
        if (alterTableError) {
          console.error("Failed to add user_id column:", alterTableError.message);
          console.log("Manual SQL needed:", `
            ALTER TABLE public.assessments 
            ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id);
            
            CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
          `);
        } else {
          console.log("User_id column added successfully");
        }
      } else {
        console.log("User_id column already exists");
      }
    }
    
    console.log("Schema fix completed successfully!");
    
  } catch (error) {
    console.error("Error fixing schema:", error);
  }
}

// Run the fix schema function
fixSchema(); 