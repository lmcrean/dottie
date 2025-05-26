import { createTables } from "../db/migrations/initialSchema.js";
import db from "../db/index.js";

/**
 * Initialize the database with all tables
 */
async function init() {
  try {
    await createTables(db);
  } catch (error) {
    console.error("Error creating database tables:", error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

// Run the initialization
init();
