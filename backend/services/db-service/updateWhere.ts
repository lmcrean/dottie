import { db } from '../../db/index.js';
import { WhereCondition, PartialDbRecord } from './types.js';

/**
 * Update records based on where condition
 * @param table - Table name
 * @param whereCondition - Where condition
 * @param updateData - Data to update
 * @returns Number of updated records
 */
export async function updateWhere(
  table: string,
  whereCondition: WhereCondition,
  updateData: PartialDbRecord
): Promise<number> {
  try {
    let query = db(table);

    // Apply where conditions
    if (whereCondition && typeof whereCondition === 'object') {
      Object.entries(whereCondition).forEach(([key, value]) => {
        query = query.where(key, value);
      });
    }

    const count = await query.update(updateData);
    return count;
  } catch (error) {
    console.error(`Error in updateWhere for ${table}:`, error);
    throw error;
  }
}
