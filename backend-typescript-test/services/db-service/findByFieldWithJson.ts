import { db } from '';

/**
 * Find many records by field and parse JSON fields
 * @param {string} table - Table name
 * @param {string} field - Field to match
 * @param {any} value - Value to match
 * @param {Array<string>} jsonFields - Fields to auto-parse
 * @param {string} [orderBy] - Optional order field
 * @returns {Promise<Array>} - Matching records
 */
export async function findByFieldWithJson(table, field, value, jsonFields = [], orderBy = null) {
  let query = db(table).where(field, value);
  if (orderBy) query = query.orderBy(orderBy, 'desc');

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
