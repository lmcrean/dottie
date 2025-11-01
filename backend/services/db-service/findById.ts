import { db } from '../../db/index.js';
import { DbRecord } from './types.js';

/**
 * Find a record by ID
 * @param table - Table name
 * @param id - Record ID
 * @returns Found record or null
 */
export async function findById<T extends DbRecord = DbRecord>(
  table: string,
  id: string | number
): Promise<T | null> {
  try {
    const record = await db(table)
      .where('id', id)
      .first();

    return (record as T) || null;
  } catch (error) {
    console.error(`Error in findById for ${table}:`, error);
    throw error;
  }
}
