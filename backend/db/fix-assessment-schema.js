import db from './index.js';
import { updateAssessmentToJsonSchema } from './migrations/updateAssessmentToJsonSchema.js';

/**
 * Fixes the assessment table schema to use JSON format
 */
async function fixAssessmentSchema() {
  try {
    console.log('Checking current database schema...');
    
    // Check if assessments table exists
    const hasTable = await db.schema.hasTable('assessments');
    console.log(`Assessments table exists: ${hasTable}`);
    
    if (hasTable) {
      // Check columns in assessments table
      const columnInfo = await db('assessments').columnInfo();
      console.log('Current columns in assessments table:', Object.keys(columnInfo));
      
      // Check if assessmentData column exists
      const hasJsonColumn = columnInfo.hasOwnProperty('assessmentData');
      console.log(`Has assessmentData column: ${hasJsonColumn}`);
      
      if (!hasJsonColumn) {
        console.log('Applying assessment JSON schema migration...');
        await updateAssessmentToJsonSchema(db);
        console.log('Migration completed successfully!');
      } else {
        console.log('Schema already has assessmentData column, no migration needed.');
      }
    } else {
      console.log('Creating assessments table with JSON schema...');
      await updateAssessmentToJsonSchema(db);
      console.log('Table created successfully!');
    }
    
    // Verify the schema after migration
    const updatedColumnInfo = await db('assessments').columnInfo();
    console.log('Updated columns in assessments table:', Object.keys(updatedColumnInfo));
    
    console.log('Schema fix completed successfully!');
  } catch (error) {
    console.error('Error fixing assessment schema:', error);
  } finally {
    // Close the database connection
    await db.destroy();
  }
}

// Run the fix if this script is executed directly
if (process.argv[1].includes('fix-assessment-schema.js')) {
  fixAssessmentSchema();
}

export default fixAssessmentSchema; 