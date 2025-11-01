import { db } from '../../db/index.js';
import { DbRecord } from './types.js';

/**
 * Get all records from a table
 * @param table - Table name
 * @returns Array of records
 */
export async function getAll<T extends DbRecord = DbRecord>(table: string): Promise<T[]> {
  try {
    const records = await db(table).select('*');
    return (records || []) as T[];
  } catch (error) {
    console.error(`Error in getAll for ${table}:`, error);
    throw error;
  }
}
