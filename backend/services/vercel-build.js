// Set VERCEL flag for database module
process.env.VERCEL = "1";
process.env.NODE_ENV = "production";
process.env.DB_TYPE = "supabase"; // Explicitly set DB_TYPE for deployment

// Import required modules 
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Log important environment configurations
console.log("Environment configuration:");
console.log(`  NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`  DB_TYPE: ${process.env.DB_TYPE}`);
console.log(`  SUPABASE_URL set: ${!!process.env.SUPABASE_URL}`);
console.log(`  SUPABASE_SERVICE_ROLE_KEY set: ${!!process.env.SUPABASE_SERVICE_ROLE_KEY}`);

// Attempt to fix the schema in Supabase if credentials are available
async function fixProductionDatabaseSchema() {
  try {
    // Check if Supabase credentials are available
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase credentials. Cannot fix schema.");
      return;
    }

    console.log("Starting schema verification...");

    // Create Supabase client with admin role key
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Check for preview column in conversations table
    try {
      console.log("Checking for preview column in conversations table...");
      
      // First check if the conversations table exists
      const { error: checkConversationsError } = await supabase
        .from("conversations")
        .select("count")
        .limit(1);
        
      if (checkConversationsError && checkConversationsError.message.includes("does not exist")) {
        console.log("Conversations table does not exist, skipping preview column check");
      } else {
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
      }
    } catch (error) {
      console.error("Error checking preview column:", error);
    }

    // Fix schema for assessments table

    // First check if the assessments table exists
    const { error: checkError } = await supabase
      .from("assessments")
      .select("count")
      .limit(1);

    // If table doesn't exist, create it with all required columns
    if (checkError && checkError.message.includes("does not exist")) {

      
      // Using rpc to execute SQL directly
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

      }
    } else {
      // Table exists, check for missing columns

      
      // Create and execute the SQL to add missing columns
      // Instead of using auth.admin.executeSql which doesn't exist,
      // we'll query the information_schema to check for columns, then
      // use separate queries to add each missing column
      
      // Check for age column
      const { data: ageColumn, error: ageError } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'assessments')
        .eq('column_name', 'age')
        .single();
      
      if (ageError || !ageColumn) {

        await supabase.rpc('exec_sql', {
          sql_query: 'ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS age TEXT;'
        });
      }
      
      // Check for cycle_length column
      const { data: cycleColumn, error: cycleError } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'assessments')
        .eq('column_name', 'cycle_length')
        .single();
      
      if (cycleError || !cycleColumn) {

        await supabase.rpc('exec_sql', {
          sql_query: 'ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS cycle_length TEXT;'
        });
      }
      
      // Check for period_duration column
      const { data: durationColumn, error: durationError } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'assessments')
        .eq('column_name', 'period_duration')
        .single();
      
      if (durationError || !durationColumn) {

        await supabase.rpc('exec_sql', {
          sql_query: 'ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS period_duration TEXT;'
        });
      }
      
      // Check for flow_heaviness column
      const { data: flowColumn, error: flowError } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'assessments')
        .eq('column_name', 'flow_heaviness')
        .single();
      
      if (flowError || !flowColumn) {

        await supabase.rpc('exec_sql', {
          sql_query: 'ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS flow_heaviness TEXT;'
        });
      }
      
      // Check for pain_level column
      const { data: painColumn, error: painError } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'assessments')
        .eq('column_name', 'pain_level')
        .single();
      
      if (painError || !painColumn) {

        await supabase.rpc('exec_sql', {
          sql_query: 'ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS pain_level TEXT;'
        });
      }
      
      // Check for physical_symptoms column
      const { data: physicalColumn, error: physicalError } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'assessments')
        .eq('column_name', 'physical_symptoms')
        .single();
      
      if (physicalError || !physicalColumn) {

        await supabase.rpc('exec_sql', {
          sql_query: 'ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS physical_symptoms TEXT;'
        });
      }
      
      // Check for emotional_symptoms column
      const { data: emotionalColumn, error: emotionalError } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'assessments')
        .eq('column_name', 'emotional_symptoms')
        .single();
      
      if (emotionalError || !emotionalColumn) {

        await supabase.rpc('exec_sql', {
          sql_query: 'ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS emotional_symptoms TEXT;'
        });
      }
      

    }

    // Verify schema after changes

    const { data: columns, error: verifyError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'assessments')
      .order('ordinal_position');

    if (verifyError) {
      console.error("Error verifying schema:", verifyError.message);
      
      // Alternative verification approach if the first method fails
      try {

        // Simple query to get column names directly from the assessments table
        const { data: assessmentData, error: assessmentError } = await supabase
          .from('assessments')
          .select('*')
          .limit(1);
          
        if (assessmentError) {
          console.error("Error in alternative verification:", assessmentError.message);
        } else {
          // If data is returned, we can look at the keys of the first row
          if (assessmentData && assessmentData.length > 0) {

          } else {

          }
        }
      } catch (altError) {
        console.error("Error in alternative verification:", altError);
      }
    } else {

    }

  } catch (error) {
    console.error("Error fixing production database schema:", error);
  }
}

// Run the schema fix during build
await fixProductionDatabaseSchema();

console.log("✅ Vercel build script completed");


