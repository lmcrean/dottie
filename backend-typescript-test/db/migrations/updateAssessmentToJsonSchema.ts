// update database schema to use JSON data

/**
 * Migration to update assessments table to use JSON data
 * @param {object} db - Knex database instance
 */
export async function updateAssessmentToJsonSchema(db) {
  const isSQLite = db.client.config.client === "sqlite3";

  // Drop the symptoms table if it exists (as we'll include symptoms in JSON)
  if (await db.schema.hasTable("symptoms")) {
    await db.schema.dropTable("symptoms");
  }

  // Drop the assessments table if it exists
  if (await db.schema.hasTable("assessments")) {
    await db.schema.dropTable("assessments");
  }

  // Create the new assessments table with JSON data
  await db.schema.createTable("assessments", (table) => {
    table.uuid("id").primary();
    table.uuid("user_id").notNullable();
    table.text("assessment_data").notNullable(); // JSON stored as text
    table.timestamps(true, true);

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

/**
 * Revert the assessments table schema back to original
 * @param {object} db - Knex database instance
 */
export async function revertJsonAssessmentSchema(db) {
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

  // Re-create the symptoms table
  await db.schema.createTable("symptoms", (table) => {
    table.increments("id").primary();
    table.uuid("user_id").notNullable();
    table.date("date").notNullable();
    table.string("type").notNullable(); // cramps, headache, mood, etc.
    table.integer("severity"); // 1-5 scale
    table.text("notes");
    table.timestamps(true, true);
  });
}
