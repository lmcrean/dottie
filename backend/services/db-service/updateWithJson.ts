import { update } from './update.js';
import { findByIdWithJson } from './findByIdWithJson.js';
import { DbRecord, PartialDbRecord } from './types.js';

/**
 * Update records with JSON fields
 * @param table - Table name
 * @param id - Record ID
 * @param data - Update data to match
 * @param jsonFields - Fields to auto-parse
 * @returns Updated record
 */
export async function updateWithJson<T extends DbRecord = DbRecord>(
  table: string,
  id: string | number,
  data: PartialDbRecord,
  jsonFields: string[] = []
): Promise<T> {
  // Validate data before spreading
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data provided to updateWithJson()');
  }

  const preparedData = { ...data };
  for (const field of jsonFields) {
    if (preparedData[field] !== undefined) {
      preparedData[field] = JSON.stringify(preparedData[field]);
    }
  }
  await update(table, id, preparedData);
  const updatedRecord = await findByIdWithJson<T>(table, id, jsonFields);

  if (!updatedRecord) {
    throw new Error(`Failed to find updated record in ${table}`);
  }

  return updatedRecord;
}
