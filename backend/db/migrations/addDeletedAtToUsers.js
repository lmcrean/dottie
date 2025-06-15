/**
 * Migration to add deleted_at column to users table for soft delete functionality
 */

/**
 * Add the deleted_at column to users table if it doesn't exist
 * @param {object} db - Knex database instance
 */
export async function addDeletedAtToUsers(db) {
  try {
    // Check if the users table exists
    const hasTable = await db.schema.hasTable('users');
    if (!hasTable) {
      console.log('Users table does not exist, skipping migration');
      return;
    }

    // Check if the deleted_at column already exists
    const hasColumn = await db.schema.hasColumn('users', 'deleted_at');
    if (hasColumn) {
      console.log('deleted_at column already exists in users table');
      return;
    }

    // Add the deleted_at column to the users table
    await db.schema.table('users', (table) => {
      table.timestamp('deleted_at').nullable();
    });
    
    console.log('Successfully added deleted_at column to users table');

  } catch (error) {
    console.error('Error adding deleted_at column to users table:', error);
    throw error;
  }
}

export default addDeletedAtToUsers; 