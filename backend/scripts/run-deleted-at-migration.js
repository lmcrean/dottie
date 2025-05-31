/**
 * Script to run the migration that adds the deleted_at column to the users table
 */
import { addDeletedAtToUsers } from '../db/migrations/addDeletedAtToUsers.js';
import { db } from '../db/index.js';

async function runMigration() {
  console.log('Starting deleted_at column migration...');
  
  try {
    // Run the migration using the existing database connection
    await addDeletedAtToUsers(db);
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration(); 