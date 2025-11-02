import { db } from '../../db/index.js';
import { findById } from './findById.js';
import { DbRecord, PartialDbRecord } from './types.js';

/**
 * Update a record
 * @param table - Table name
 * @param id - Record ID
 * @param data - Update data
 * @returns Updated record
 */
export async function update<T extends DbRecord = DbRecord>(
  table: string,
  id: string | number,
  data: PartialDbRecord
): Promise<T> {
  try {
    await db(table)
      .where('id', id)
      .update(data);

    // For compatibility, fetch the updated record
    const updatedRecord = await findById<T>(table, id);
    return updatedRecord as T;
  } catch (error) {
    console.error(`Error in update for ${table}:`, error);
    throw error;
  }
}
