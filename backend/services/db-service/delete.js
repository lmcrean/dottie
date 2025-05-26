import { db } from '../../db/index.js';

/**
 * Delete record(s) from a table
 * @param {string} table - Table name
 * @param {string|number|Object} option - Record ID or conditions object
 * @returns {Promise<boolean>} - Success flag
 */
export async function deleteRecord(table, option) {
  try {
    let query = db(table);

    if (typeof option === 'object' && option !== null) {
      // Handle each condition in the object
      Object.entries(option).forEach(([key, value]) => {
        query = query.where(key, value);
      });
    } else {
      // Simple ID-based deletion
      query = query.where('id', option);
    }

    const count = await query.delete();
    return count > 0;
  } catch (error) {
    console.error(`Error deleting from ${table}:`, error);
    throw error;
  }
} 