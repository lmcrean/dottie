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
    // Validate data before spreading
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data provided to createWithJson()');
    }

    const preparedData = { ...data };

    for (const field of jsonFields) {
      if (preparedData[field] !== undefined) {
        preparedData[field] = JSON.stringify(preparedData[field]);
      }
    }

    // Filter out undefined values to prevent NULL being inserted
    // This allows database defaults (like gen_random_uuid() for id) to work
    const cleanedData = Object.fromEntries(
      Object.entries(preparedData).filter(([_, value]) => value !== undefined)
    );

    // Use returning() for PostgreSQL compatibility
    // SQLite returns [id], PostgreSQL needs .returning() to return data
    const result = await db(table)
      .insert(cleanedData)
      .returning('*');

    // PostgreSQL returns an array of objects, SQLite returns an array of IDs
    const id = result[0]?.id || result[0] || data.id;

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