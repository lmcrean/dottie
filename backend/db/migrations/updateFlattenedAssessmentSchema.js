/**
 * Migration script to update assessment schema from nested to flattened structure
 * This changes the assessments table to have individual columns for all assessment fields
 * instead of keeping them in a JSON field called assessment_data
 * 
 * @param {object} db - Knex database instance
 */
export async function updateFlattenedAssessmentSchema(db) {
  const isSQLite = db.client.config.client === "sqlite3";
  
  // Check if assessments table exists
  const hasTable = await db.schema.hasTable("assessments");

  if (hasTable) {
    // Alter the existing assessments table to add new flattened columns
    await db.schema.alterTable("assessments", (table) => {
      // Add the flattened fields from assessment_data
      if (!hasColumn(db, "assessments", "age")) table.string("age");
      if (!hasColumn(db, "assessments", "pattern")) table.string("pattern");
      if (!hasColumn(db, "assessments", "cycle_length")) table.string("cycle_length");
      if (!hasColumn(db, "assessments", "period_duration")) table.string("period_duration");
      if (!hasColumn(db, "assessments", "flow_heaviness")) table.string("flow_heaviness");
      if (!hasColumn(db, "assessments", "pain_level")) table.string("pain_level");
      
      // Add columns for arrays with JSON format
      if (!hasColumn(db, "assessments", "physical_symptoms")) table.text("physical_symptoms");
      if (!hasColumn(db, "assessments", "emotional_symptoms")) table.text("emotional_symptoms");
      if (!hasColumn(db, "assessments", "recommendations")) table.text("recommendations");
    });

    // Migrate existing data from nested structure to flattened structure
    const assessments = await db("assessments").select();
    
    for (const assessment of assessments) {
      if (!assessment.assessment_data) continue;
      
      let assessmentData;
      try {
        // Parse the assessment_data JSON if it's stored as string
        assessmentData = typeof assessment.assessment_data === 'string' 
          ? JSON.parse(assessment.assessment_data) 
          : assessment.assessment_data;
      } catch (error) {
        console.error(`Failed to parse assessment_data for assessment ${assessment.id}:`, error);
        continue;
      }
      
      // Extract fields from nested structure
      const updates = {
        age: assessmentData.age,
        pattern: assessmentData.pattern,
        cycle_length: assessmentData.cycleLength,
        period_duration: assessmentData.periodDuration,
        flow_heaviness: assessmentData.flowHeaviness,
        pain_level: assessmentData.painLevel,
        physical_symptoms: assessmentData.symptoms?.physical 
          ? JSON.stringify(assessmentData.symptoms.physical) 
          : null,
        emotional_symptoms: assessmentData.symptoms?.emotional 
          ? JSON.stringify(assessmentData.symptoms.emotional)
          : null,
        recommendations: assessmentData.recommendations
          ? JSON.stringify(assessmentData.recommendations)
          : null
      };
      
      // Update the record with flattened data
      await db("assessments")
        .where("id", assessment.id)
        .update(updates);
    }
  } else {
    // Create new assessments table with flattened structure if it doesn't exist
    await db.schema.createTable("assessments", (table) => {
      table.string("id").primary();
      table.string("user_id").notNullable();
      table.string("created_at").notNullable();
      table.string("updated_at").notNullable();
      
      // Flattened fields
      table.string("age");
      table.string("pattern");
      table.string("cycle_length");
      table.string("period_duration");
      table.string("flow_heaviness");
      table.string("pain_level");
      
      // Array fields stored as JSON
      table.text("physical_symptoms");
      table.text("emotional_symptoms");
      table.text("recommendations");
      
      // Keep assessment_data for backwards compatibility during transition
      table.text("assessment_data");
      
      // Foreign key handling based on database type
      if (!isSQLite) {
        table.foreign("user_id").references("users.id");
      } else {
        try {
          table.foreign("user_id").references("users.id");
        } catch (error) {
          console.warn(
            "Warning: Could not create foreign key - common with SQLite:",
            error.message
          );
        }
      }
    });
  }
}

/**
 * Helper function to check if a column exists in a table
 * @param {object} db - Knex database instance
 * @param {string} table - Table name
 * @param {string} column - Column name
 * @returns {Promise<boolean>} - True if column exists
 */
async function hasColumn(db, table, column) {
  try {
    const info = await db(table).columnInfo();
    return !!info[column];
  } catch (error) {
    console.error(`Error checking for column ${column} in ${table}:`, error);
    return false;
  }
}

/**
 * Revert the flattened assessment schema back to nested
 * @param {object} db - Knex database instance
 */
export async function revertFlattenedAssessmentSchema(db) {
  // Check if assessments table exists
  if (await db.schema.hasTable("assessments")) {
    // Remove the flattened columns
    await db.schema.alterTable("assessments", (table) => {
      table.dropColumn("age");
      table.dropColumn("pattern");
      table.dropColumn("cycle_length");
      table.dropColumn("period_duration");
      table.dropColumn("flow_heaviness");
      table.dropColumn("pain_level");
      table.dropColumn("physical_symptoms");
      table.dropColumn("emotional_symptoms");
      table.dropColumn("recommendations");
    });
  }
} 