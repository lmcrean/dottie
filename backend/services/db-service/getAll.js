import { db } from '../../db/index.js';

/**
 * Get all records from a table
 * @param {string} table - Table name
 * @returns {Promise<Array>} - Array of records
 */
export async function getAll(table) {
  try {
    const records = await db(table).select('*');
    return records || [];
  } catch (error) {
    console.error(`Error in getAll for ${table}:`, error);
    throw error;
  }
} 