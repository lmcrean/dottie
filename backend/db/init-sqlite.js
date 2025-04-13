import db from './index.js';
import { createTables } from './migrations/initialSchema.js';

/**
 * Initialize SQLite database with required tables
 */
async function initializeSQLiteDatabase() {
  try {
    console.log('Initializing SQLite database...');
    await createTables(db);
    console.log('SQLite database initialized successfully!');
  } catch (error) {
    console.error('Error initializing SQLite database:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await db.destroy();
  }
}

// Run the initialization if this file is executed directly
if (process.argv[1].includes('init-sqlite.js')) {
  initializeSQLiteDatabase();
}

export default initializeSQLiteDatabase; 