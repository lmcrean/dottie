import { db } from '../../db/index.js';

/**
 * Find many records by field and parse JSON fields
 * @param {string} table - Table name
 * @param {string} field - Field to match
 * @param {any} value - Value to match
 * @param {Array<string>} jsonFields - Fields to auto-parse
 * @param {string|object|Array} [orderBy] - Optional order field (string) or object {field, direction} or array of such objects
 * @returns {Promise<Array>} - Matching records
 */
export async function findByFieldWithJson(table, field, value, jsonFields = [], orderBy = null) {
  let query = db(table).where(field, value);
  
  if (orderBy) {
    if (Array.isArray(orderBy)) {
      // Apply each sort criterion individually instead of using orderByRaw
      orderBy.forEach(ob => {
        query = query.orderBy(ob.field, (ob.direction || 'asc').toLowerCase());
      });
    } else if (typeof orderBy === 'string') {
      query = query.orderBy(orderBy, 'desc'); // Default to desc if only string is provided
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