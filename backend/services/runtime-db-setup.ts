// Runtime database setup for production deployments
// This runs when the server starts, not during build time

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export async function initializeDatabase(): Promise<void> {
  // Only run in production/Vercel environment
  if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
    console.log("Skipping database initialization - not in production/Vercel environment");
    return;
  }

  try {
    // Check if Supabase credentials are available
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log("Supabase credentials not available, skipping database setup");
      return;
    }

    console.log("Starting runtime database setup...");

    // Create Supabase client with admin role key
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Check for preview column in conversations table
    await checkConversationsPreviewColumn(supabase);

    // Check assessments table schema
    await checkAssessmentsTable(supabase);

    console.log("✅ Runtime database setup complete!");

  } catch (error: any) {
    console.error("Database setup error:", error.message);
    // Don't fail the server startup - log the error and continue
  }
}

async function checkConversationsPreviewColumn(supabase: SupabaseClient): Promise<void> {
  try {
    console.log("Checking for preview column in conversations table...");

    // First check if the conversations table exists
    const { error: checkConversationsError } = await supabase
      .from("conversations")
      .select("count")
      .limit(1);

    if (checkConversationsError && checkConversationsError.message.includes("does not exist")) {
      console.log("Conversations table does not exist, skipping preview column check");
      return;
    }

    // Check for preview column
    const { data: previewColumn, error: previewError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'conversations')
      .eq('column_name', 'preview')
      .single();

    if (previewError || !previewColumn) {
      console.log("Adding preview column to conversations table...");

      await supabase.rpc('exec_sql', {
        sql_query: 'ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS preview TEXT;'
      });

      console.log("✅ Added preview column to conversations table");
    } else {
      console.log("✅ Preview column already exists in conversations table");
    }
  } catch (error: any) {
    console.error("Error checking preview column:", error.message);
  }
}

async function checkAssessmentsTable(supabase: SupabaseClient): Promise<void> {
  try {
    console.log("Checking assessments table schema...");

    // First check if the assessments table exists
    const { error: checkError } = await supabase
      .from("assessments")
      .select("count")
      .limit(1);

    // If table doesn't exist, create it with all required columns
    if (checkError && checkError.message.includes("does not exist")) {
      console.log("Creating assessments table...");

      const { error: createError } = await supabase.rpc('exec_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS public.assessments (
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
        `
      });

      if (createError) {
        console.error("Error creating assessments table:", createError.message);
      } else {
        console.log("✅ Created assessments table");
      }
    } else {
      // Table exists, check for missing columns
      console.log("Assessments table exists, checking for missing columns...");

      const columnsToCheck = ['age', 'cycle_length', 'period_duration', 'flow_heaviness', 'pain_level'];

      for (const columnName of columnsToCheck) {
        const { data: column, error } = await supabase
          .from('information_schema.columns')
          .select('column_name')
          .eq('table_schema', 'public')
          .eq('table_name', 'assessments')
          .eq('column_name', columnName)
          .single();

        if (error || !column) {
          console.log(`Adding ${columnName} column to assessments table...`);
          await supabase.rpc('exec_sql', {
            sql_query: `ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS ${columnName} TEXT;`
          });
        }
      }

      console.log("✅ Assessments table schema check complete");
    }
  } catch (error: any) {
    console.error("Error checking assessments table:", error.message);
  }
}
