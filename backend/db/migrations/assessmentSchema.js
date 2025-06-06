// Assessment schema updates to match test requirements

/**
 * Update the assessments table schema to match test requirements
 * @param {object} db - Knex database instance
 */
export async function updateAssessmentSchema(db) {
  const isSQLite = db.client.config.client === "sqlite3";

  // Check if assessments table exists
  if (await db.schema.hasTable("assessments")) {
    // Drop the existing assessments table
    await db.schema.dropTable("assessments");
  }

  // Create the assessments table with updated schema
  await db.schema.createTable("assessments", (table) => {
    table.string("id").primary(); // Use string ID for test IDs
    table.string("user_id").notNullable();
    table.string("created_at").notNullable();
    table.string("age");
    table.string("pattern");
    table.string("cycle_length");
    table.string("period_duration");
    table.string("flow_heaviness");
    table.string("pain_level");
    table.text("physical_symptoms");
    table.text("emotional_symptoms");
    table.text("other_symptoms");
    table.text("recommendations");

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

  // Drop existing symptoms table if it exists
  if (await db.schema.hasTable("symptoms")) {
    await db.schema.dropTable("symptoms");
  }

  // Create symptoms table with the correct schema for tests
  await db.schema.createTable("symptoms", (table) => {
    table.increments("id").primary();
    table.string("assessment_id").notNullable();
    table.string("symptom_name").notNullable();
    table.string("symptom_type").notNullable(); // 'physical' or 'emotional'

    // Foreign key handling based on database type
    if (!isSQLite) {
      table.foreign("assessment_id").references("assessments.id");
    } else {
      try {
        table.foreign("assessment_id").references("assessments.id");
      } catch (error) {
        console.warn(
          "Warning: Could not create foreign key - common with SQLite:",
          error.message
        );
      }
    }
  });
}

/**
 * Revert the assessments table schema back to original
 * @param {object} db - Knex database instance
 */
export async function revertAssessmentSchema(db) {
  // Drop the symptoms table
  if (await db.schema.hasTable("symptoms")) {
    await db.schema.dropTable("symptoms");
  }

  // Drop the assessments table
  if (await db.schema.hasTable("assessments")) {
    await db.schema.dropTable("assessments");
  }

  // Re-create the original assessments table
  await db.schema.createTable("assessments", (table) => {
    table.increments("id").primary();
    table.uuid("user_id").notNullable();
    table.date("date").notNullable();
    table.string("result_category").notNullable(); // green, yellow, red
    table.text("recommendations");
    table.timestamps(true, true);
  });
}
