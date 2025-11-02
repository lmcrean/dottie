/**
 * Migration: Add refresh_tokens table
 * Created: 2025-01-12
 *
 * This migration creates a table to store refresh tokens in the database
 * instead of in-memory storage. This enables:
 * - Persistent token storage across server restarts
 * - Horizontal scaling support
 * - Token revocation capabilities
 * - Security audit trail
 */
import type { Knex } from 'knex';

/**
 * Create the refresh_tokens table
 * @param db - Knex database instance
 */
export async function up(db: Knex): Promise<void> {
  const isSQLite = db.client.config.client === "sqlite3";

  // Check if the table already exists
  if (await db.schema.hasTable("refresh_tokens")) {
    console.log("⚠️  refresh_tokens table already exists, skipping creation");
    return;
  }

  console.log("📦 Creating refresh_tokens table...");

  await db.schema.createTable("refresh_tokens", (table) => {
    table.increments("id").primary();
    table.uuid("user_id").notNullable();
    table.string("token_hash", 255).notNullable();
    table.timestamp("expires_at").notNullable();
    table.timestamp("created_at").defaultTo(db.fn.now());

    // Add indices for performance
    table.index("user_id");
    table.index("expires_at");
    table.index("token_hash");

    // Foreign key handling based on database type
    if (!isSQLite) {
      table.foreign("user_id").references("users.id").onDelete("CASCADE");
    } else {
      try {
        table.foreign("user_id").references("users.id").onDelete("CASCADE");
      } catch (error) {
        console.warn(
          "Warning: Could not create foreign key - common with SQLite:",
          (error as Error).message
        );
      }
    }
  });

  console.log("✅ refresh_tokens table created successfully");
}

/**
 * Rollback the migration (drop the table)
 * @param db - Knex database instance
 */
export async function down(db: Knex): Promise<void> {
  if (await db.schema.hasTable("refresh_tokens")) {
    console.log("🗑️  Dropping refresh_tokens table...");
    await db.schema.dropTable("refresh_tokens");
    console.log("✅ refresh_tokens table dropped");
  }
}

/**
 * Create the refresh_tokens table (alias for up)
 * @param db - Knex database instance
 */
export async function createRefreshTokensTable(db: Knex): Promise<void> {
  return up(db);
}

export default {
  up,
  down,
  createRefreshTokensTable,
};
