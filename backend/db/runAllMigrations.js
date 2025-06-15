import db from "./index.js";
import { createTables } from "./migrations/initialSchema.js";
import { updateAssessmentSchema } from "./migrations/assessmentSchema.js";
import { addAssessmentFieldsToConversations } from "./migrations/addAssessmentFieldsToConversations.js";
import { addAssessmentObjectToConversations } from "./migrations/addAssessmentObjectToConversations.js";
import { addOtherSymptomsColumn } from "./migrations/add-other-symptoms.js";
import { addDeletedAtToUsers } from "./migrations/addDeletedAtToUsers.js";
import logger from "../services/logger.js";

/**
 * Run all database migrations in order
 */
export async function runAllMigrations() {
  try {
    logger.info("Starting database migrations...");
    
    // 1. Create initial tables
    logger.info("Creating initial tables...");
    await createTables(db);
    
    // 2. Update assessment schema
    logger.info("Updating assessment schema...");
    await updateAssessmentSchema(db);
    
    // 3. Add assessment fields to conversations
    logger.info("Adding assessment fields to conversations...");
    await addAssessmentFieldsToConversations(db);
    
    // 4. Add assessment object to conversations
    logger.info("Adding assessment object to conversations...");
    await addAssessmentObjectToConversations(db);
    
    // 5. Add other symptoms column
    logger.info("Adding other symptoms column...");
    await addOtherSymptomsColumn(db);
    
    // 6. Add deleted_at column to users table
    logger.info("Adding deleted_at column to users table...");
    await addDeletedAtToUsers(db);
    
    logger.info("All migrations completed successfully");
  } catch (error) {
    logger.error("Error running migrations:", error);
    throw error;
  }
}

// Run migrations if this file is executed directly
if (process.argv[1].includes("runAllMigrations.js")) {
  runAllMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
    .finally(() => db.destroy());
}

export default runAllMigrations; 