#!/usr/bin/env node

import DbService from '../services/db-service/dbService.js';
import logger from '../services/logger.js';
import { addAssessmentObjectToConversations } from '../db/migrations/addAssessmentObjectToConversations.js';

const runMigration = async () => {
  try {
    logger.info('Starting assessment object migration...');
    
    // Get the database instance
    const db = DbService.getDbInstance();
    
    // Run the migration
    await addAssessmentObjectToConversations(db);
    
    logger.info('Assessment object migration completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error running assessment object migration:', error);
    process.exit(1);
  }
};

// Run the migration
runMigration(); 