/**
 * Script to run the assessment fields migration for conversations table
 * This adds assessment_id and assessment_pattern fields to enable linking
 * conversations to specific assessments
 */

import db from '../db/index.js';
import { addAssessmentFieldsToConversations } from '../db/migrations/addAssessmentFieldsToConversations.js';

async function runMigration() {
  try {
    console.log('Starting assessment fields migration for conversations table...');
    
    await addAssessmentFieldsToConversations(db);
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close database connection
    await db.destroy();
  }
}

// Run the migration
runMigration(); 