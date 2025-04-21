import db from './index.js';
import { createTables } from './migrations/initialSchema.js';
import { updateAssessmentToJsonSchema } from './migrations/updateAssessmentToJsonSchema.js';

/**
 * Initialize SQLite database with required tables
 */
async function initializeSQLiteDatabase() {
  try {
    console.log('Initializing SQLite database...');
    await createTables(db);
    
    // Ensure assessment table uses JSON schema
    console.log('Ensuring assessment table uses JSON schema...');
    const columnInfo = await db('assessments').columnInfo();
    if (!columnInfo.hasOwnProperty('assessmentData')) {
      console.log('Applying JSON schema to assessments table...');
      await updateAssessmentToJsonSchema(db);
      console.log('JSON schema applied successfully.');
    } else {
      console.log('Assessment table already using JSON schema.');
    }
    
    console.log('SQLite database initialized successfully!');
  } catch (error) {
    console.error('Error initializing SQLite database:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await db.destroy();
  }
}

// Run the initialization if this file is executed directly
if (process.argv[1].includes('init-sqlite.js')) {
  initializeSQLiteDatabase();
}

export default initializeSQLiteDatabase; 