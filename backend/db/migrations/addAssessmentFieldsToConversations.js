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
    // Check if assessment_id column already exists
    const hasAssessmentId = await db.schema.hasColumn('conversations', 'assessment_id');
    const hasAssessmentPattern = await db.schema.hasColumn('conversations', 'assessment_pattern');
    
    if (hasAssessmentId && hasAssessmentPattern) {
      console.log('Assessment fields already exist in conversations table');
      return;
    }
    
    // Add the assessment-related columns only if they don't exist
    await db.schema.table('conversations', (table) => {
      // Add assessment_id as foreign key to assessments table
      if (!hasAssessmentId) {
        table.string('assessment_id').nullable();
      }
      
      // Add assessment_pattern as a reference field
      if (!hasAssessmentPattern) {
        table.string('assessment_pattern').nullable();
      }
      
      // Add foreign key constraints if not SQLite
      if (!isSQLite && !hasAssessmentId) {
        try {
          table.foreign('assessment_id').references('assessments.id');
        } catch (error) {
          console.warn('Warning: Could not create foreign key for assessment_id:', error.message);
        }
      }
    });
    
    console.log('Successfully added assessment fields to conversations table');
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