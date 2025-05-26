import { update } from './update.js';
import { findByIdWithJson } from './findByIdWithJson.js';

/**
 * Update records with JSON fields
 * @param {string} table - Table name
 * @param {string|number} id - Record ID
 * @param {any} data - update data to match
 * @param {Array<string>} jsonFields - Fields to auto-parse
 * @returns {Promise<Array>} - Matching records
 */
export async function updateWithJson(table, id, data, jsonFields = []) {
  const preparedData = { ...data };
  for (const field of jsonFields) {
    if (preparedData[field] !== undefined) {
      preparedData[field] = JSON.stringify(preparedData[field]);
    }
  }
  await update(table, id, preparedData);
  return await findByIdWithJson(table, id, jsonFields);
} 