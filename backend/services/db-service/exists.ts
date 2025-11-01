import { db } from '../../db/index.js';

/**
 * Check if a record exists in a table by ID
 * @param table - Table name
 * @param id - Record ID
 * @returns True if record exists, false otherwise
 */
export async function exists(table: string, id: string | number): Promise<boolean> {
  try {
    console.log(`[exists] Checking if record ${id} exists in ${table}`);

    const record = await db(table)
      .where('id', id)
      .first();

    const recordExists = !!record;
    console.log(`[exists] Record ${id} in ${table} exists: ${recordExists}`);

    return recordExists;
  } catch (error) {
    console.error(`[exists] Error checking if record ${id} exists in ${table}:`, error);
    return false;
  }
}
