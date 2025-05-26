/**
 * Script to run the assessment fields migration for conversations table
 * This adds assessment_id and assessment_pattern fields to enable linking
 * conversations to specific assessments
 */

import db from '../db/index.ts';
import { addAssessmentFieldsToConversations } from '../db/migrations/addAssessmentFieldsToConversations.ts';

async function runMigration() {
  try {

    
    await addAssessmentFieldsToConversations(db);
    

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close database connection
    await db.destroy();
  }
}

// Run the migration
runMigration(); 
