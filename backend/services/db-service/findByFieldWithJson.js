import { db } from '../../db/index.js';

/**
 * Find many records by field and parse JSON fields
 * @param {string} table - Table name
 * @param {string} field - Field to match
 * @param {any} value - Value to match
 * @param {Array<string>} jsonFields - Fields to auto-parse
 * @param {string|object} [orderBy] - Optional order field (string) or object {field, direction}
 * @returns {Promise<Array>} - Matching records
 */
export async function findByFieldWithJson(table, field, value, jsonFields = [], orderBy = null) {
  let query = db(table).where(field, value);
  
  if (orderBy) {
    if (typeof orderBy === 'string') {
      query = query.orderBy(orderBy, 'desc');
    } else if (typeof orderBy === 'object' && orderBy.field) {
      query = query.orderBy(orderBy.field, orderBy.direction || 'asc');
    }
  }

  const records = await query;

  return records.map(record => {
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
  });
} 