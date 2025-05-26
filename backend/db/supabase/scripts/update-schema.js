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

async function createTableIfNeeded() {
  console.log("Starting schema update process...");

  try {
    // Check if the assessments table exists by querying it
    const { error: assessmentCheckError } = await supabase
      .from("assessments")
      .select("id")
      .limit(1);

    if (assessmentCheckError) {
      console.log("Error checking assessments table:", assessmentCheckError.message);
      
      if (assessmentCheckError.message.includes("relation") && assessmentCheckError.message.includes("does not exist")) {
        console.log("Assessments table doesn't exist. You need to create it in the Supabase dashboard.");
        console.log("Run this SQL in the Supabase SQL Editor:");
        console.log(`
          CREATE TABLE IF NOT EXISTS public.assessments (
            id UUID PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES public.users(id),
            assessment_data JSONB NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
          
          CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
        `);
      }
    } else {
      console.log("Assessments table exists, checking for issues...");
      
      // Try to insert a test record to see if we get specific schema errors
      const testRecord = {
        id: '00000000-0000-0000-0000-000000000000',
        user_id: '00000000-0000-0000-0000-000000000001',
        assessment_data: {}
      };
      
      const { error: insertError } = await supabase
        .from("assessments")
        .upsert(testRecord)
        .select();
      
      if (insertError) {
        console.log("Error testing assessments table:", insertError.message);
        
        if (insertError.message.includes("user_id")) {
          console.log("Issue with user_id column detected. Run this SQL in the Supabase SQL Editor:");
          console.log(`
            -- Check if user_id column exists
            DO $$
            BEGIN
              IF NOT EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_schema = 'public'
                AND table_name = 'assessments'
                AND column_name = 'user_id'
              ) THEN
                -- Add user_id column if it doesn't exist
                ALTER TABLE public.assessments 
                ADD COLUMN user_id UUID REFERENCES public.users(id);
                
                CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
              END IF;
            END $$;
          `);
        }
      } else {
        console.log("Assessment table schema appears to be correct.");
        
        // Delete the test record
        await supabase
          .from("assessments")
          .delete()
          .eq("id", '00000000-0000-0000-0000-000000000000');
      }
    }
    
    console.log("Schema update process completed.");
    
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

// Run the function
createTableIfNeeded(); 