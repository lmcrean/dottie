import db from '';
import { createTables } from '';

/**
 * Initialize SQLite database with required tables
 */
async function initializeSQLiteDatabase() {
  try {
    await createTables(db);
  } catch (error) {
    console.error("Error initializing SQLite database:", error);
    process.exit(1);
  } finally {
    // Close database connection
    await db.destroy();
  }
}

// Run the initialization if this file is executed directly
if (process.argv[1].includes("init-sqlite.js")) {
  initializeSQLiteDatabase();
}

export default initializeSQLiteDatabase;

