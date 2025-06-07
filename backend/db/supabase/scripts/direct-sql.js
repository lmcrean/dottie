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

async function executeSQL() {
  try {


    // Check if the assessments table exists by querying it
    const { data: assessmentCheck, error: assessmentCheckError } = await supabase
      .from("assessments")
      .select("*")
      .limit(1);

    if (assessmentCheckError) {

      
      if (assessmentCheckError.message.includes("relation") && assessmentCheckError.message.includes("does not exist")) {

        
        // Direct PostgreSQL query to create the assessments table
        const { error } = await supabase.auth.admin.executeSql(`
          CREATE TABLE IF NOT EXISTS public.assessments (
            id UUID PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES public.users(id),
            assessment_data JSONB NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
          
          CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
        `);
        
        if (error) {
          console.error("Failed to create table:", error.message);
        } else {

        }
      }
    } else {

      
      // Direct PostgreSQL query to check columns
      const { data, error } = await supabase.auth.admin.executeSql(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'assessments';
      `);
      
      if (error) {
        console.error("Failed to check columns:", error.message);
      } else {

        
        const columns = data.map(row => row.column_name);
        if (!columns.includes('user_id')) {

          
          // Direct PostgreSQL query to add the user_id column
          const { error: alterError } = await supabase.auth.admin.executeSql(`
            ALTER TABLE public.assessments 
            ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id);
            
            CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
          `);
          
          if (alterError) {
            console.error("Failed to add user_id column:", alterError.message);
          } else {

          }
        } else {

        }
      }
    }


    
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

// Run the SQL execution function
executeSQL(); 