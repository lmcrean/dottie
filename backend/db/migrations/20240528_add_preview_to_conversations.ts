/**
 * Migration to add preview column to conversations table
 */
import type { Knex } from 'knex';

/**
 * Add preview column to conversations table
 * @param db - Knex database instance
 */
export async function addPreviewToConversations(db: Knex): Promise<void> {
  // Check if preview column exists before adding it to avoid errors on repeat runs
  const hasPreviewColumn = await db.schema.hasColumn('conversations', 'preview');

  if (!hasPreviewColumn) {
    await db.schema.alterTable('conversations', (table) => {
      table.text('preview').nullable();
    });
  }
}

/**
 * Rollback migration
 * @param db - Knex database instance
 */
export async function removePreviewFromConversations(db: Knex): Promise<void> {
  await db.schema.alterTable('conversations', (table) => {
    table.dropColumn('preview');
  });
}

// Export up and down functions for compatibility with Knex migrations
export const up = addPreviewToConversations;
export const down = removePreviewFromConversations;
