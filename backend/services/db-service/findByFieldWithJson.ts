import { db } from '../../db/index.js';
import { DbRecord, SortOrder } from './types.js';

/**
 * Order by specification
 */
type OrderBySpec =
  | string
  | { field: string; direction?: SortOrder }
  | Array<{ field: string; direction?: SortOrder }>;

/**
 * Find many records by field and parse JSON fields
 * @param table - Table name
 * @param field - Field to match
 * @param value - Value to match
 * @param jsonFields - Fields to auto-parse
 * @param orderBy - Optional order field (string) or object {field, direction} or array of such objects
 * @returns Matching records
 */
export async function findByFieldWithJson<T extends DbRecord = DbRecord>(
  table: string,
  field: string,
  value: any,
  jsonFields: string[] = [],
  orderBy: OrderBySpec | null = null
): Promise<T[]> {
  let query = db(table).where(field, value);

  if (orderBy) {
    if (Array.isArray(orderBy)) {
      // Apply each sort criterion individually instead of using orderByRaw
      orderBy.forEach(ob => {
        query = query.orderBy(ob.field, (ob.direction || 'asc').toLowerCase() as 'asc' | 'desc');
      });
    } else if (typeof orderBy === 'string') {
      query = query.orderBy(orderBy, 'desc'); // Default to desc if only string is provided
    } else if (typeof orderBy === 'object' && orderBy.field) {
      query = query.orderBy(orderBy.field, orderBy.direction || 'asc');
    }
  }

  const records = await query;

  return records.map(record => {
    for (const jsonField of jsonFields) {
      if (record[jsonField]) {
        try {
          record[jsonField] = JSON.parse(record[jsonField]);
        } catch (err) {
          console.warn(`Failed to parse field ${jsonField} in ${table}:`, err);
        }
      }
    }
    return record as T;
  });
}
