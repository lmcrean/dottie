// Admin-only route to fix database schema issues
import express from 'express';
import db from '../../db/index.js';

const router = express.Router();

// Schema fix route - protected by admin key
router.get('/fix-schema', async (req, res) => {
  try {
    // Check for admin key to prevent unauthorized access
    const adminKey = req.headers['x-admin-key'] || req.query.admin_key;
    
    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Admin key required'
      });
    }
    

    
    // Get database type for logging
    const dbType = db.client.config.client;

    
    // Check if assessments table exists
    const hasTable = await db.schema.hasTable('assessments');

    
    if (hasTable) {
      // Check for the age column
      let hasAgeColumn = false;
      try {
        const columnInfo = await db('assessments').columnInfo();
        hasAgeColumn = !!columnInfo.age;
        


      } catch (err) {
        console.error('Error checking columns:', err.message);
      }
      
      // Add age column if it doesn't exist
      if (!hasAgeColumn) {
        try {

          await db.schema.alterTable('assessments', (table) => {
            table.string('age');
          });

        } catch (alterErr) {
          console.error('Error adding age column:', alterErr.message);
          
          // If alter table fails, try with raw SQL
          try {

            await db.raw('ALTER TABLE assessments ADD COLUMN age TEXT');

          } catch (rawErr) {
            console.error('Raw SQL also failed:', rawErr.message);
            return res.status(500).json({
              error: 'Schema Fix Failed',
              message: 'Failed to add age column',
              details: rawErr.message
            });
          }
        }
      }
      
      // Check for and add other required columns
      const requiredColumns = [
        'cycle_length', 'period_duration', 'flow_heaviness', 
        'pain_level', 'physical_symptoms', 'emotional_symptoms'
      ];
      
      const columnInfo = await db('assessments').columnInfo();
      
      for (const column of requiredColumns) {
        if (!columnInfo[column]) {
          try {

            await db.schema.alterTable('assessments', (table) => {
              table.string(column);
            });

          } catch (colErr) {
            console.error(`Error adding ${column} column:`, colErr.message);
            
            // Try raw SQL
            try {
              await db.raw(`ALTER TABLE assessments ADD COLUMN ${column} TEXT`);

            } catch (rawColErr) {
              console.error(`Raw SQL failed for ${column}:`, rawColErr.message);
            }
          }
        }
      }
      
      // Get final column list
      const finalColumns = Object.keys(await db('assessments').columnInfo());
      
      return res.status(200).json({
        success: true,
        message: 'Schema fix completed',
        table_exists: true,
        columns: finalColumns
      });
      
    } else {
      // Create assessments table if it doesn't exist

      
      await db.schema.createTable('assessments', (table) => {
        table.string('id').primary();
        table.string('user_id').notNullable();
        table.string('created_at').notNullable();
        table.string('age');
        table.string('pattern');
        table.string('cycle_length');
        table.string('period_duration');
        table.string('flow_heaviness');
        table.string('pain_level');
        table.text('physical_symptoms');
        table.text('emotional_symptoms');
        table.text('recommendations');
        table.text('assessment_data');
      });
      

      
      return res.status(200).json({
        success: true,
        message: 'Assessments table created',
        table_created: true
      });
    }
    
  } catch (error) {
    console.error('Error in fix-schema route:', error);
    return res.status(500).json({
      error: 'Schema Fix Failed',
      message: error.message
    });
  }
});

export default router; 