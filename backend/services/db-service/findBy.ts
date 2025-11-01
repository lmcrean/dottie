import { db } from '../../db/index.js';
import { DbRecord } from './types.js';

/**
 * Find records by a field value
 * @param table - Table name
 * @param field - Field name
 * @param value - Field value
 * @returns Array of found records
 */
export async function findBy<T extends DbRecord = DbRecord>(
  table: string,
  field: string,
  value: any
): Promise<T[]> {
  try {
    const records = await db(table)
      .where(field, value);

    return (records || []) as T[];
  } catch (error) {
    console.error(`Error in findBy for ${table}:`, error);
    throw error;
  }
}
