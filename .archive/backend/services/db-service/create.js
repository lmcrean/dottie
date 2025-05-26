import { db } from '../../db/index.js';
import { findById } from './findById.js';

/**
 * Create a new record
 * @param {string} table - Table name
 * @param {object} data - Record data
 * @returns {Promise<object>} - Created record
 */
export async function create(table, data) {
  try {
    const [id] = await db(table)
      .insert(data);

    // For SQLite compatibility, fetch the record after insertion
    const insertedRecord = await findById(table, data.id || id);
    return insertedRecord;
  } catch (error) {
    console.error(`Error in create for ${table}:`, error);
    throw error;
  }
} 