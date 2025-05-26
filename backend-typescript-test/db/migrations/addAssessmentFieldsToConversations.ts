/**
 * Migration to add assessment-related fields to conversations table
 * This allows conversations to be linked to specific assessments and patterns
 * 
 * @param {object} db - Knex database instance
 */
export async function addAssessmentFieldsToConversations(db) {

  
  const isSQLite = db.client.config.client === 'sqlite3';
  
  // Check if the conversations table exists
  if (await db.schema.hasTable('conversations')) {

    
    // Add the assessment-related columns
    await db.schema.table('conversations', (table) => {
      // Add assessment_id as foreign key to assessments table
      table.string('assessment_id').nullable();
      
      // Add assessment_pattern as a reference field (could be FK to pattern table in future)
      table.string('assessment_pattern').nullable();
      
      // Add foreign key constraints if not SQLite
      if (!isSQLite) {
        try {
          table.foreign('assessment_id').references('assessments.id');
        } catch (error) {
          console.warn('Warning: Could not create foreign key for assessment_id:', error.message);
        }
      }
    });
    

  } else {
    console.warn('Conversations table does not exist, skipping migration');
  }
}

/**
 * Revert the assessment fields from conversations table
 * @param {object} db - Knex database instance
 */
export async function revertAssessmentFieldsFromConversations(db) {

  
  if (await db.schema.hasTable('conversations')) {
    await db.schema.table('conversations', (table) => {
      table.dropColumn('assessment_id');
      table.dropColumn('assessment_pattern');
    });
    

  }
} 