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
  console.log('Running fixChatTimestampColumns migration...');
  const isSQLite = db.client.config.client === 'sqlite3';
  const isPg = db.client.config.client === 'pg';

  // Check if the conversations table exists
  if (await db.schema.hasTable('conversations')) {
    console.log('Conversations table exists, checking columns...');

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

    console.log('Existing columns:', columns);

    // Check if we need to add the snake_case columns
    const hasCreatedAt = columns.includes('created_at');
    const hasUpdatedAt = columns.includes('updated_at');
    const hasCamelCaseCreatedAt = columns.includes('createdAt');
    const hasCamelCaseUpdatedAt = columns.includes('updatedAt');

    // If we don't have snake_case columns but have camelCase ones, we need to fix
    if ((!hasCreatedAt && hasCamelCaseCreatedAt) || (!hasUpdatedAt && hasCamelCaseUpdatedAt)) {
      console.log('Adding missing snake_case timestamp columns to conversations table...');

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
        console.log('Copying data from createdAt to created_at...');
        await db.raw(`UPDATE conversations SET created_at = "createdAt"`);
      }

      if (!hasUpdatedAt && hasCamelCaseUpdatedAt) {
        console.log('Copying data from updatedAt to updated_at...');
        await db.raw(`UPDATE conversations SET updated_at = "updatedAt"`);
      }

      console.log('Successfully migrated timestamp data from camelCase to snake_case');
    } else {
      console.log('Conversations table already has proper snake_case columns');
    }
  }

  // Check if the chat_messages table exists and needs fixing
  if (await db.schema.hasTable('chat_messages')) {
    console.log('Chat_messages table exists, checking columns...');

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

    console.log('Existing columns:', columns);

    // Check if we need to add the snake_case column
    const hasCreatedAt = columns.includes('created_at');
    const hasCamelCaseCreatedAt = columns.includes('createdAt');

    // If we don't have snake_case column but have camelCase one, we need to fix
    if (!hasCreatedAt && hasCamelCaseCreatedAt) {
      console.log('Adding missing snake_case created_at column to chat_messages table...');

      // Add missing column
      await db.schema.table('chat_messages', table => {
        table.timestamp('created_at').nullable();
      });

      // Copy data from camelCase to snake_case column
      console.log('Copying data from createdAt to created_at...');
      await db.raw(`UPDATE chat_messages SET created_at = "createdAt"`);

      console.log('Successfully migrated timestamp data from camelCase to snake_case');
    } else {
      console.log('Chat_messages table already has proper snake_case columns');
    }
  }
}

// If this file is run directly, execute the migration
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  import('../../db/index.js').then(async ({ db }) => {
    console.log('Running fixChatTimestampColumns migration directly...');
    await fixChatTimestampColumns(db);
    console.log('Migration completed successfully!');
    process.exit(0);
  }).catch(err => {
    console.error('Error running migration:', err);
    process.exit(1);
  });
} 