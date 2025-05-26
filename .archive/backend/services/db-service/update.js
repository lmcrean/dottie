import { db } from '../../db/index.js';
import { findById } from './findById.js';

/**
 * Update a record
 * @param {string} table - Table name
 * @param {string|number} id - Record ID
 * @param {object} data - Update data
 * @returns {Promise<object>} - Updated record
 */
export async function update(table, id, data) {
  try {
    await db(table)
      .where('id', id)
      .update(data);

    // For compatibility, fetch the updated record
    const updatedRecord = await findById(table, id);
    return updatedRecord;
  } catch (error) {
    console.error(`Error in update for ${table}:`, error);
    throw error;
  }
} 