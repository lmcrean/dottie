import { findById } from './findById.ts';

/**
 * Find a record by ID and auto-parse JSON fields
 * @param {string} table - Table name
 * @param {string|number} id - Record ID
 * @param {Array<string>} jsonFields - Fields to auto-parse
 * @returns {Promise<object|null>} - Found record or null
 */
export async function findByIdWithJson(table, id, jsonFields = []) {
  const record = await findById(table, id);

  if (!record) return null;

  for (const field of jsonFields) {
    if (record[field]) {
      try {
        record[field] = JSON.parse(record[field]);
      } catch (err) {
        console.warn(`Failed to parse field ${field} in ${table}:`, err);
      }
    }
  }

  return record;
} 
