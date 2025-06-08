// include updateAssessmentToJsonSchema.js - updated assessment table to use JSON
import { updateAssessmentToJsonSchema } from "./updateAssessmentToJsonSchema.js";

//for test - TODO: remove
import { updateAssessmentSchema } from "./assessmentSchema.js";

/**
 * Create all tables for the Dottie application
 * @param {object} db - Knex database instance
 */
export async function createTables(db) {
  const isSQLite = db.client.config.client === "sqlite3";

  // Check if the healthcheck table exists
  if (!(await db.schema.hasTable("healthcheck"))) {
    // Create the healthcheck table
    await db.schema.createTable("healthcheck", (table) => {
      table.increments("id").primary();
      table.timestamp("checked_at").defaultTo(db.fn.now());
    });
    // Insert a dummy record to ensure the table is not empty
    await db("healthcheck").insert({});
  }

  // Users table
  if (!(await db.schema.hasTable("users"))) {
    await db.schema.createTable("users", (table) => {
      table.uuid("id").primary();
      table.string("username").notNullable().unique();
      table.string("email").notNullable().unique();
      table.string("password_hash").notNullable();
      table.integer("age");
      table.text('encrypted_key');
      table.text('key_salt');
      table.text('key_iv');
      table.timestamps(true, true);
    });
  }

  // Periods tracking table
  if (!(await db.schema.hasTable("period_logs"))) {
    await db.schema.createTable("period_logs", (table) => {
      table.increments("id").primary();
      table.uuid("user_id").notNullable();
      table.date("start_date").notNullable();
      table.date("end_date");
      table.integer("flow_level"); // 1-5 scale
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

  // Symptoms tracking table
  if (!(await db.schema.hasTable("symptoms"))) {
    await db.schema.createTable("symptoms", (table) => {
      table.increments("id").primary();
      table.uuid("user_id").notNullable();
      table.date("date").notNullable();
      table.string("type").notNullable(); // cramps, headache, mood, etc.
      table.integer("severity"); // 1-5 scale
      table.text("notes");
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

  // Conversations table
  if (!(await db.schema.hasTable("conversations"))) {
    await db.schema.createTable("conversations", (table) => {
      table.uuid("id").primary();
      table.uuid("user_id").notNullable();
      table.text("assessment_id");
      table.text("assessment_pattern");
      table.text("assessment_object");
      table.timestamps(true, true);

      // Foreign key handling based on database type
      if (!isSQLite) {
        table.foreign("user_id").references("users.id");
        table.foreign("assessment_id").references("assessments.id")
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

  // Chat messages table
  if (!(await db.schema.hasTable("chat_messages"))) {
    await db.schema.createTable("chat_messages", (table) => {
      table.uuid("id").primary();
      table.uuid("conversation_id").notNullable();
      table.string("role").notNullable(); // 'user' or 'assistant'
      table.text("content").notNullable();
      table.uuid("parent_message_id").nullable(); // For message threading
      table.timestamp("created_at").defaultTo(db.fn.now());

      // Foreign key handling based on database type
      if (!isSQLite) {
        table.foreign("conversation_id").references("conversations.id");
        table.foreign("parent_message_id").references("chat_messages.id");
      } else {
        try {
          table.foreign("conversation_id").references("conversations.id");
          table.foreign("parent_message_id").references("chat_messages.id");
        } catch (error) {
          console.warn(
            "Warning: Could not create foreign key - common with SQLite:",
            error.message
          );
        }
      }
    });
  }

  // Determine which assessment schema to use
  if (process.env.TEST_MODE === "true") {
    // In test mode, use the special assessment schema (includes 'age')

    await updateAssessmentSchema(db);
  } else {
    // For development/production, ensure the flattened schema with 'age' is used.
    // We can directly call updateAssessmentSchema as it handles dropping and recreating if needed.

    await updateAssessmentSchema(db);
  }

  // Enable foreign keys in SQLite
  if (isSQLite) {
    try {
      await db.raw("PRAGMA foreign_keys = ON");
    } catch (error) {
      console.warn(
        "Warning: Could not enable foreign keys in SQLite:",
        error.message
      );
    }
  }
}

/**
 * Drop all tables from the database
 * @param {object} db - Knex database instance
 */
export async function dropTables(db) {
  await db.schema.dropTableIfExists("assessments");
  await db.schema.dropTableIfExists("symptoms");
  await db.schema.dropTableIfExists("period_logs");
  await db.schema.dropTableIfExists("users");
  await db.schema.dropTableIfExists("chat_messages");
  await db.schema.dropTableIfExists("conversations");
}
