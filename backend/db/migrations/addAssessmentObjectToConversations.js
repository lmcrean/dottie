/**
 * Migration to add assessment_object field to conversations table
 * This stores the complete assessment data as JSON for easy access
 * 
 * @param {object} db - Knex database instance
 */
export async function addAssessmentObjectToConversations(db) {
  
  const isSQLite = db.client.config.client === 'sqlite3';
  
  // Check if the conversations table exists
  if (await db.schema.hasTable('conversations')) {
    
    // Check if column already exists
    const hasColumn = await db.schema.hasColumn('conversations', 'assessment_object');
    
    if (!hasColumn) {
      // Add the assessment_object column
      await db.schema.table('conversations', (table) => {
        // Add assessment_object as JSON/JSONB field
        if (isSQLite) {
          // SQLite doesn't have native JSON type, use TEXT
          table.text('assessment_object').nullable();
        } else {
          // PostgreSQL has native JSONB type
          table.jsonb('assessment_object').nullable();
        }
      });
      
      console.log('Successfully added assessment_object column to conversations table');
    } else {
      console.log('assessment_object column already exists in conversations table');
    }
    
  } else {
    console.warn('Conversations table does not exist, skipping migration');
  }
}

/**
 * Revert the assessment_object field from conversations table
 * @param {object} db - Knex database instance
 */
export async function revertAssessmentObjectFromConversations(db) {
  
  if (await db.schema.hasTable('conversations')) {
    const hasColumn = await db.schema.hasColumn('conversations', 'assessment_object');
    
    if (hasColumn) {
      await db.schema.table('conversations', (table) => {
        table.dropColumn('assessment_object');
      });
      
      console.log('Successfully removed assessment_object column from conversations table');
    }
  }
} 