import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

console.log("Starting schema cache clearing script...");

async function clearSchemaCache() {
  try {
    // Check if Supabase credentials are available
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log("Supabase credentials not found in environment. Cannot clear schema cache.");
      return;
    }

    console.log("Found Supabase credentials. Attempting to clear schema cache...");
    console.log("Supabase URL:", process.env.SUPABASE_URL);

    // Create Supabase client with service role key for admin operations
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    console.log("Supabase client created successfully.");

    // Force a requery of schema metadata by doing a small operation on the assessments table
    console.log("Performing operation to reset schema cache...");
    
    // First, let's try to query columns to make Supabase refresh the schema
    console.log("Querying assessments table to refresh schema...");
    const { data: columns, error } = await supabase
      .from('assessments')
      .select('id')
      .limit(1);
      
    if (error) {
      console.log("Initial query error (expected if table is empty):", error.message);
    } else {
      console.log("Successfully queried assessments table:", columns);
    }
    
    // Now try a small dummy update that won't actually change anything but will
    // force Supabase to recheck the schema
    console.log("Attempting dummy update to force schema refresh...");
    const { data: updateResult, error: updateError } = await supabase
      .from('assessments')
      .update({ updated_at: new Date().toISOString() })
      .filter('id', 'eq', 'dummy-id-that-doesnt-exist');
      
    if (updateError && !updateError.message.includes('does not exist')) {
      console.error("Error trying to refresh schema:", updateError.message);
    } else {
      console.log("Schema cache refresh operation completed.");
    }
    
    // Now try to create a dummy record with all required fields to force schema refresh
    console.log("Creating dummy record to force complete schema refresh...");
    const dummyId = `dummy-refresh-${Date.now()}`;
    const dummyRecord = {
      id: dummyId,
      user_id: 'dummy-user-id',
      created_at: new Date().toISOString(),
      age: '30',
      pattern: 'regular',
      cycle_length: '28',
      period_duration: '5',
      flow_heaviness: 'medium',
      pain_level: 'mild',
      physical_symptoms: JSON.stringify(['none']),
      emotional_symptoms: JSON.stringify(['none']),
      recommendations: JSON.stringify([])
    };
    
    console.log("Dummy record data:", dummyRecord);
    
    const { data: insertData, error: insertError } = await supabase
      .from('assessments')
      .insert(dummyRecord)
      .select();
      
    if (insertError) {
      console.log("Insert error (this is normal if constraints prevent insertion):", insertError.message);
    } else {
      console.log("Dummy record created to refresh schema:", insertData);
      console.log("Cleaning up dummy record...");
      // Cleanup the dummy record
      const { error: deleteError } = await supabase
        .from('assessments')
        .delete()
        .eq('id', dummyId);
        
      if (deleteError) {
        console.log("Error deleting dummy record:", deleteError.message);
      } else {
        console.log("Dummy record removed successfully.");
      }
    }
    
    // Final verification
    console.log("Performing final verification query...");
    const { data: verifyData, error: verifyError } = await supabase
      .from('assessments')
      .select('*')
      .limit(1);
      
    if (verifyError) {
      console.log("Verification error:", verifyError.message);
    } else {
      console.log("Verification successful. Available columns:", verifyData ? Object.keys(verifyData[0] || {}) : "No data returned");
    }
    
    console.log("Schema cache reset operations completed. The cache should be refreshed now.");
    
  } catch (error) {
    console.error("Error clearing schema cache:", error);
  }
}

// Run the function
clearSchemaCache().then(() => {
  console.log("Script execution completed. Press Ctrl+C to exit.");
}); 