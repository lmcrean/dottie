import { db } from '../../db/index.js';

/**
 * Check if a record exists in a table by ID
 * @param {string} table - Table name
 * @param {string} id - Record ID
 * @returns {Promise<boolean>} - True if record exists, false otherwise
 */
export async function exists(table, id) {
  try {
    console.log(`[exists] Checking if record ${id} exists in ${table}`);
    
    const record = await db(table)
      .where('id', id)
      .first();
    
    const exists = !!record;
    console.log(`[exists] Record ${id} in ${table} exists: ${exists}`);
    
    return exists;
  } catch (error) {
    console.error(`[exists] Error checking if record ${id} exists in ${table}:`, error);
    return false;
  }
} 