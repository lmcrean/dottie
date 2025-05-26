import { db } from '../../db/index.js';

/**
 * Find records by a field value
 * @param {string} table - Table name
 * @param {string} field - Field name
 * @param {any} value - Field value
 * @returns {Promise<Array>} - Array of found records
 */
export async function findBy(table, field, value) {
  try {
    const records = await db(table)
      .where(field, value);

    return records || [];
  } catch (error) {
    console.error(`Error in findBy for ${table}:`, error);
    throw error;
  }
} 