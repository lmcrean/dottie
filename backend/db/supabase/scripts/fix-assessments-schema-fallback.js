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

async function fixAssessmentsSchemaFallback() {
  try {


    // Backup existing data if table exists
    let existingData = [];
    try {
      const { data, error } = await supabase.from("assessments").select("*");
      if (!error && data) {
        existingData = data;

      }
    } catch (backupError) {

    }

    // Drop the assessments table if it exists

    const { error: dropError } = await supabase.auth.admin.executeSql(`
      DROP TABLE IF EXISTS public.assessments;
    `);

    if (dropError) {
      console.error("Error dropping assessments table:", dropError.message);
      return;
    }

    // Create the assessments table with the correct schema

    const { error: createError } = await supabase.auth.admin.executeSql(`
      CREATE TABLE public.assessments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL,
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
      
      // If the UUID extension isn't available, try without it
      if (createError.message.includes("uuid_generate_v4")) {

        const { error: retryError } = await supabase.auth.admin.executeSql(`
          CREATE TABLE public.assessments (
            id UUID PRIMARY KEY,
            user_id UUID NOT NULL,
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
        
        if (retryError) {
          console.error("Error on second attempt to create table:", retryError.message);
          return;
        }
      } else {
        return;
      }
    }

    // Restore existing data if we had any
    if (existingData.length > 0) {

      
      for (const record of existingData) {
        const { error: insertError } = await supabase
          .from("assessments")
          .insert(record);
          
        if (insertError) {
          console.error(`Error restoring record ${record.id}:`, insertError.message);
        }
      }
      

    }

    // Verify the schema

    const { data: columns, error: verifyError } = await supabase.auth.admin.executeSql(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'assessments'
      ORDER BY ordinal_position;
    `);

    if (verifyError) {
      console.error("Error verifying schema:", verifyError.message);
      return;
    }




  } catch (error) {
    console.error("Unexpected error during schema fix:", error);
  }
}

// Run the fix
fixAssessmentsSchemaFallback(); 