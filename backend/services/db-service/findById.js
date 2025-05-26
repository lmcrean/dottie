import { db } from '../../db/index.js';

/**
 * Find a record by ID
 * @param {string} table - Table name
 * @param {string|number} id - Record ID
 * @returns {Promise<object|null>} - Found record or null
 */
export async function findById(table, id) {
  try {
    const record = await db(table)
      .where('id', id)
      .first();

    return record || null;
  } catch (error) {
    console.error(`Error in findById for ${table}:`, error);
    throw error;
  }
} 