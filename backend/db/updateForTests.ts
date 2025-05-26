import db from './index.ts';
import { updateAssessmentSchema } from '../types/common';

/**
 * Apply schema updates for tests
 */
async function updateDatabaseForTests() {
  try {
    await updateAssessmentSchema(db);
  } catch (error) {
    console.error("Error updating database schema:", error);
    process.exit(1);
  } finally {
    // Close database connection
    if (db.destroy) {
      await db.destroy();
    }
  }
}

// Run the update if this file is executed directly
if (process.argv[1].includes("updateForTests.js")) {
  updateDatabaseForTests();
}

export default updateDatabaseForTests;

