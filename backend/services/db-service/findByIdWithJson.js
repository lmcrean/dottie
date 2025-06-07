import { findById } from './findById.js';

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
        // Skip parsing if it's already an object (PostgreSQL jsonb column)
        if (typeof record[field] === 'object') {
          continue;
        }
        
        // Skip parsing if it's the literal string "[object Object]"
        if (record[field] === '[object Object]') {
          console.warn(`Field ${field} in ${table} contains "[object Object]" string, setting to empty object`);
          record[field] = {};
          continue;
        }
        
        // Try to parse the JSON string
        record[field] = JSON.parse(record[field]);
      } catch (err) {
        console.warn(`Failed to parse field ${field} in ${table}:`, err);
        // Set to empty object instead of leaving invalid JSON
        record[field] = {};
      }
    }
  }

  return record;
} 