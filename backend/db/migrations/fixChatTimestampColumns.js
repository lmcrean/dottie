/**
 * Migration to fix the camelCase timestamp columns in the conversations table
 * 
 * In some environments, Knex's timestamps() function creates camelCase columns (createdAt, updatedAt)
 * but our code expects snake_case columns (created_at, updated_at).
 * 
 * This migration will:
 * 1. Check if snake_case columns exist
 * 2. If not, create them
 * 3. Copy data from camelCase to snake_case columns
 */

import { fileURLToPath } from 'url';

export async function fixChatTimestampColumns(db) {

  const isSQLite = db.client.config.client === 'sqlite3';
  const isPg = db.client.config.client === 'pg';

  // Check if the conversations table exists
  if (await db.schema.hasTable('conversations')) {


    // Get table info to check which columns exist
    let columns;
    if (isPg) {
      // PostgreSQL
      columns = await db.raw(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'conversations'
      `);
      columns = columns.rows.map(row => row.column_name);
    } else if (isSQLite) {
      // SQLite
      const tableInfo = await db.raw(`PRAGMA table_info(conversations)`);
      columns = tableInfo.map(col => col.name);
    } else {
      // Generic approach - less reliable but a fallback
      try {
        const row = await db('conversations').first();
        columns = row ? Object.keys(row) : [];
      } catch (e) {
        console.warn('Could not fetch column names using generic approach:', e);
        columns = [];
      }
    }



    // Check if we need to add the snake_case columns
    const hasCreatedAt = columns.includes('created_at');
    const hasUpdatedAt = columns.includes('updated_at');
    const hasCamelCaseCreatedAt = columns.includes('createdAt');
    const hasCamelCaseUpdatedAt = columns.includes('updatedAt');

    // If we don't have snake_case columns but have camelCase ones, we need to fix
    if ((!hasCreatedAt && hasCamelCaseCreatedAt) || (!hasUpdatedAt && hasCamelCaseUpdatedAt)) {


      // Add missing columns
      await db.schema.table('conversations', table => {
        if (!hasCreatedAt && hasCamelCaseCreatedAt) {
          table.timestamp('created_at').nullable();
        }
        if (!hasUpdatedAt && hasCamelCaseUpdatedAt) {
          table.timestamp('updated_at').nullable();
        }
      });

      // Copy data from camelCase to snake_case columns
      if (!hasCreatedAt && hasCamelCaseCreatedAt) {

        await db.raw(`UPDATE conversations SET created_at = "createdAt"`);
      }

      if (!hasUpdatedAt && hasCamelCaseUpdatedAt) {

        await db.raw(`UPDATE conversations SET updated_at = "updatedAt"`);
      }


    } else {

    }
  }

  // Check if the chat_messages table exists and needs fixing
  if (await db.schema.hasTable('chat_messages')) {


    // Get table info to check which columns exist
    let columns;
    if (isPg) {
      // PostgreSQL
      columns = await db.raw(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'chat_messages'
      `);
      columns = columns.rows.map(row => row.column_name);
    } else if (isSQLite) {
      // SQLite
      const tableInfo = await db.raw(`PRAGMA table_info(chat_messages)`);
      columns = tableInfo.map(col => col.name);
    } else {
      // Generic approach - less reliable but a fallback
      try {
        const row = await db('chat_messages').first();
        columns = row ? Object.keys(row) : [];
      } catch (e) {
        console.warn('Could not fetch column names using generic approach:', e);
        columns = [];
      }
    }



    // Check if we need to add the snake_case column
    const hasCreatedAt = columns.includes('created_at');
    const hasCamelCaseCreatedAt = columns.includes('createdAt');

    // If we don't have snake_case column but have camelCase one, we need to fix
    if (!hasCreatedAt && hasCamelCaseCreatedAt) {


      // Add missing column
      await db.schema.table('chat_messages', table => {
        table.timestamp('created_at').nullable();
      });

      // Copy data from camelCase to snake_case column

      await db.raw(`UPDATE chat_messages SET created_at = "createdAt"`);


    } else {

    }
  }
}

// If this file is run directly, execute the migration
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  import('../../db/index.js').then(async ({ db }) => {

    await fixChatTimestampColumns(db);

    process.exit(0);
  }).catch(err => {
    console.error('Error running migration:', err);
    process.exit(1);
  });
} 