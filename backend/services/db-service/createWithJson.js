import { db } from '../../db/index.js';
import { findById } from './findById.js';

/**
 * Create a new record with JSON fields auto-stringified
 * @param {string} table - Table name
 * @param {object} data - Record data
 * @param {Array<string>} jsonFields - Fields to stringify
 * @returns {Promise<object>} - Created record
 */
export async function createWithJson(table, data, jsonFields = []) {
  try {
    const preparedData = { ...data };

    for (const field of jsonFields) {
      if (preparedData[field] !== undefined) {
        preparedData[field] = JSON.stringify(preparedData[field]);
      }
    }

    const [id] = await db(table).insert(preparedData);

    const insertedRecord = await findById(table, data.id || id);

    // Auto-parse JSON fields
    for (const field of jsonFields) {
      if (insertedRecord?.[field]) {
        try {
          insertedRecord[field] = JSON.parse(insertedRecord[field]);
        } catch (err) {
          console.warn(`Failed to parse field ${field} in ${table}:`, err);
        }
      }
    }

    return insertedRecord;
  } catch (error) {
    console.error(`Error in createWithJson for ${table}:`, error);
    throw error;
  }
} 