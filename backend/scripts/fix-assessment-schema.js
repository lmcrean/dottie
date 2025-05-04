/**
 * Fix Assessment Schema Script
 * 
 * This script directly recreates the assessments table with the correct schema for tests.
 * It's a targeted fix for the integration test issues.
 */

import db from '../db/index.js';
import logger from '../services/logger/index.js';

async function fixAssessmentSchema() {
  try {
    logger.info('Starting assessment schema fix...');

    // Drop the assessments table if it exists
    if (await db.schema.hasTable('assessments')) {
      logger.info('Dropping existing assessments table...');
      await db.schema.dropTable('assessments');
      logger.info('Assessments table dropped.');
    }

    // Create the assessments table with the required columns
    logger.info('Creating assessments table with updated schema...');
    await db.schema.createTable('assessments', (table) => {
      table.string('id').primary();
      table.string('user_id').notNullable();
      table.string('created_at').notNullable();
      table.string('updated_at').notNullable();
      table.string('age');
      table.string('pattern');
      table.string('cycle_length');
      table.string('period_duration');
      table.string('flow_heaviness');
      table.string('pain_level');
      table.text('physical_symptoms');
      table.text('emotional_symptoms');
      table.text('recommendations');
      table.text('assessment_data'); // Keep for backward compatibility
    });

    logger.info('Assessments table created with updated schema.');

    // Confirm the new schema
    const columnInfo = await db('assessments').columnInfo();
    logger.info('New assessments table schema:', Object.keys(columnInfo));
    
    logger.info('Assessment schema fix completed successfully!');
  } catch (error) {
    logger.error('Error fixing assessment schema:', error);
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