#!/usr/bin/env node

/**
 * Script to update assessment schema from nested to flattened structure
 * This is the entry point for running the migration
 */

import { updateFlattenedAssessmentSchema } from '../db/migrations/updateFlattenedAssessmentSchema.js';
import db from '../db/index.js';

async function runMigration() {

  
  try {
    // Run the migration
    await updateFlattenedAssessmentSchema(db);

    
    // Example of what changed


  "id": "uuid-here",
  "user_id": "user-uuid-here",
  "created_at": "2023-01-01T00:00:00.000Z",
  "age": "25-34",
  "pattern": "regular",
  "cycle_length": "26-30",
  "period_duration": "4-5",
  "flow_heaviness": "moderate",
  "pain_level": "moderate",
  "physical_symptoms": ["Bloating", "Headaches"],
  "emotional_symptoms": ["Mood swings", "Irritability"],
  "recommendations": [
    {
      "title": "Recommendation 1",
      "description": "Description for recommendation 1"
    }
  ],
  "updated_at": "2023-01-01T00:00:00.000Z"
}`);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    await db.destroy();
  }
}

// Run the migration
runMigration(); 