/**
 * Fix Assessment Schema Script
 *
 * This script directly recreates the assessments table with the correct schema for tests
 * using raw SQL for maximum reliability.
 */

import db from '../db/index.js';

async function fixAssessmentSchema(): Promise<void> {
  try {
    console.log('🔧 Fixing assessment schema...');

    // Drop the assessments table if it exists
    if (await db.schema.hasTable('assessments')) {
      console.log('Dropping existing assessments table...');
      await db.schema.dropTable('assessments');
      console.log('✅ Dropped assessments table');
    }

    // Create the assessments table with the required columns using direct SQL
    console.log('Creating assessments table with correct schema...');

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
    console.log('✅ Created assessments table');

    // Confirm the new schema
    const columns = await db.raw('PRAGMA table_info(assessments)');
    console.log('✅ Assessment schema fixed successfully');
    console.log('Schema:', columns);

  } catch (error) {
    console.error('Error fixing assessment schema:', error);
  } finally {
    // Close database connection
    await db.destroy();
  }
}

// Run the fix if this file is executed directly
if (process.argv[1].includes('fix-assessment-schema.js') || process.argv[1].includes('fix-assessment-schema.ts')) {
  fixAssessmentSchema();
}

export default fixAssessmentSchema;
