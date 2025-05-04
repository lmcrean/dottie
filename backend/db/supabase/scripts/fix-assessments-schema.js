import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Validate required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in the environment");
  process.exit(1);
}

// Create a Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixAssessmentsSchema() {
  try {
    console.log("Starting fix for assessments table schema in Supabase...");

    // Check if assessments table exists
    const { error: checkError } = await supabase
      .from("assessments")
      .select("count")
      .limit(1);

    if (checkError && checkError.message.includes("does not exist")) {
      console.log("Assessments table does not exist. Creating it...");
      
      // Create the assessments table with all required columns
      const { error: createError } = await supabase.auth.admin.executeSql(`
        CREATE TABLE IF NOT EXISTS public.assessments (
          id UUID PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES public.users(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          age TEXT,
          pattern TEXT,
          cycle_length TEXT,
          period_duration TEXT,
          flow_heaviness TEXT,
          pain_level TEXT,
          physical_symptoms TEXT,
          emotional_symptoms TEXT,
          recommendations TEXT,
          assessment_data JSONB
        );
      `);

      if (createError) {
        console.error("Error creating assessments table:", createError.message);
        return;
      }
      
      console.log("Assessments table created successfully with correct schema.");
    } else {
      console.log("Assessments table exists. Checking for age column...");
      
      // Check if the age column exists
      const { data: columnInfo, error: columnError } = await supabase.rpc("get_column_info", {
        table_name: "assessments",
        column_name: "age"
      }).maybeSingle();

      if (columnError || !columnInfo) {
        console.log("Age column does not exist. Adding it...");
        
        // Add the age column if it doesn't exist
        const { error: alterError } = await supabase.auth.admin.executeSql(`
          ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS age TEXT;
        `);

        if (alterError) {
          console.error("Error adding age column:", alterError.message);
          return;
        }
        
        console.log("Age column added successfully.");
      } else {
        console.log("Age column already exists.");
      }
    }

    // Verify the schema
    const { data: columns, error: verifyError } = await supabase.auth.admin.executeSql(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'assessments';
    `);

    if (verifyError) {
      console.error("Error verifying schema:", verifyError.message);
      return;
    }

    console.log("Current assessments table schema columns:", columns);
    console.log("Schema fix completed successfully!");

  } catch (error) {
    console.error("Unexpected error during schema fix:", error);
  }
}

// Run the fix
fixAssessmentsSchema(); 