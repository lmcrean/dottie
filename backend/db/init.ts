import db from './index.ts';
import { createTables } from './migrations/initialSchema.ts';

/**
 * Initialize the database with required tables
 */
async function initializeDatabase() {
  try {
    await createTables(db);
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  } finally {
    // Close database connection
    await db.destroy();
  }
}

// Run the initialization if this file is executed directly
if (process.argv[1].includes("init.js")) {
  initializeDatabase();
}

export default initializeDatabase;


export { createTables };