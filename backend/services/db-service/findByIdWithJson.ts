import { findById } from './findById.js';
import { DbRecord } from './types.js';

/**
 * Find a record by ID and auto-parse JSON fields
 * @param table - Table name
 * @param id - Record ID
 * @param jsonFields - Fields to auto-parse
 * @returns Found record or null
 */
export async function findByIdWithJson<T extends DbRecord = DbRecord>(
  table: string,
  id: string | number,
  jsonFields: string[] = []
): Promise<T | null> {
  const record = await findById<T>(table, id);

  if (!record) return null;

  for (const field of jsonFields) {
    if ((record as any)[field]) {
      try {
        // Skip parsing if it's already an object (PostgreSQL jsonb column)
        if (typeof (record as any)[field] === 'object') {
          continue;
        }

        // Skip parsing if it's the literal string "[object Object]"
        if ((record as any)[field] === '[object Object]') {
          console.warn(`Field ${field} in ${table} contains "[object Object]" string, setting to empty object`);
          (record as any)[field] = {};
          continue;
        }

        // Try to parse the JSON string
        (record as any)[field] = JSON.parse((record as any)[field] as string);
      } catch (err) {
        console.warn(`Failed to parse field ${field} in ${table}:`, err);
        // Set to empty object instead of leaving invalid JSON
        (record as any)[field] = {};
      }
    }
  }

  return record;
}
