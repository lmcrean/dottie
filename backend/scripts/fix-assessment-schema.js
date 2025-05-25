/**
 * Fix Assessment Schema Script
 * 
 * This script directly recreates the assessments table with the correct schema for tests
 * using raw SQL for maximum reliability.
 */

import db from '../db/index.js';

async function fixAssessmentSchema() {
  try {


    // Drop the assessments table if it exists
    if (await db.schema.hasTable('assessments')) {

      await db.schema.dropTable('assessments');

    }

    // Create the assessments table with the required columns using direct SQL

    
    const createTableSQL = `
      CREATE TABLE assessments (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        age TEXT,
        pattern TEXT,
        cycle_length TEXT,
        period_duration TEXT,
        flow_heaviness TEXT,
        pain_level TEXT,
        physical_symptoms TEXT,
        emotional_symptoms TEXT,
        other_symptoms TEXT,
        recommendations TEXT,
        assessment_data TEXT
      );
    `;
    
    await db.raw(createTableSQL);


    // Confirm the new schema
    const columns = await db.raw('PRAGMA table_info(assessments)');

    

  } catch (error) {
    console.error('Error fixing assessment schema:', error);
  } finally {
    // Close database connection
    await db.destroy();
  }
}

// Run the fix if this file is executed directly
if (process.argv[1].includes('fix-assessment-schema.js')) {
  fixAssessmentSchema();
}

export default fixAssessmentSchema; 