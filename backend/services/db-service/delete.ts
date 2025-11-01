import { db } from '../../db/index.js';
import { DeleteOption } from './types.js';

/**
 * Delete record(s) from a table
 * @param table - Table name
 * @param option - Record ID or conditions object
 * @returns Success flag
 */
export async function deleteRecord(table: string, option: DeleteOption): Promise<boolean> {
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
