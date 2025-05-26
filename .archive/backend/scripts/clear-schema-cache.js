import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();



async function clearSchemaCache() {
  try {
    // Check if Supabase credentials are available
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {

      return;
    }




    // Create Supabase client with service role key for admin operations
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );



    // Force a requery of schema metadata by doing a small operation on the assessments table

    
    // First, let's try to query columns to make Supabase refresh the schema

    const { data: columns, error } = await supabase
      .from('assessments')
      .select('id')
      .limit(1);
      
    if (error) {

    } else {

    }
    
    // Now try a small dummy update that won't actually change anything but will
    // force Supabase to recheck the schema

    const { data: updateResult, error: updateError } = await supabase
      .from('assessments')
      .update({ updated_at: new Date().toISOString() })
      .filter('id', 'eq', 'dummy-id-that-doesnt-exist');
      
    if (updateError && !updateError.message.includes('does not exist')) {
      console.error("Error trying to refresh schema:", updateError.message);
    } else {

    }
    
    // Now try to create a dummy record with all required fields to force schema refresh

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
    

    
    const { data: insertData, error: insertError } = await supabase
      .from('assessments')
      .insert(dummyRecord)
      .select();
      
    if (insertError) {

    } else {


      // Cleanup the dummy record
      const { error: deleteError } = await supabase
        .from('assessments')
        .delete()
        .eq('id', dummyId);
        
    }
    
    // Final verification

    const { data: verifyData, error: verifyError } = await supabase
      .from('assessments')
      .select('*')
      .limit(1);
      
    if (verifyError) {

    } else {

    }
    

    
  } catch (error) {
    console.error("Error clearing schema cache:", error);
  }
}

// Run the function
clearSchemaCache().then(() => {

}); 