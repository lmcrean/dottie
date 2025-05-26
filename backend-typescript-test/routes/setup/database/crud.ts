import express from 'express';
import supabase from '../../../services/supabaseService.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get('/', async (req, res) => {
  const TABLE_NAME = 'temp_test_crud';
  const testId = uuidv4();
  
  try {
    // Create temporary table if it doesn't exist
    await supabase.rpc('create_temp_test_table');
    
    // Insert a test record
    const { data: insertData, error: insertError } = await supabase
      .from(TABLE_NAME)
      .insert({
        id: testId,
        name: 'Test User',
        created_at: new Date().toISOString()
      })
      .select();
    
    if (insertError) throw insertError;
    
    // Read the test record
    const { data: readData, error: readError } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', testId)
      .single();
    
    if (readError) throw readError;
    
    // Update the test record
    const { data: updateData, error: updateError } = await supabase
      .from(TABLE_NAME)
      .update({ name: 'Updated Test User' })
      .eq('id', testId)
      .select();
    
    if (updateError) throw updateError;
    
    // Delete the test record
    const { error: deleteError } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', testId);
    
    if (deleteError) throw deleteError;
    
    return res.json({
      success: true,
      message: `Successfully performed CRUD operations on Supabase database`,
      databaseType: 'Supabase'
    });
  } catch (error) {
    console.error('Database CRUD test error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to perform CRUD operations on database',
      error: error.message
    });
  }
});

export default router; 