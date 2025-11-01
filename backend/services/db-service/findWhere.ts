import { db } from '../../db/index.js';
import { DbRecord, WhereCondition, QueryOptions } from './types.js';

/**
 * Find records based on where condition
 * @param table - Table name
 * @param whereCondition - Where condition
 * @param options - Query options
 * @returns Array of found records
 */
export async function findWhere<T extends DbRecord = DbRecord>(
  table: string,
  whereCondition: WhereCondition,
  options: QueryOptions = {}
): Promise<T[]> {
  try {
    console.log(`[findWhere] Querying ${table} with condition:`, JSON.stringify(whereCondition));
    console.log(`[findWhere] Options:`, JSON.stringify(options));

    let query = db(table);

    // Apply where conditions
    if (whereCondition && typeof whereCondition === 'object') {
      Object.entries(whereCondition).forEach(([key, value]) => {
        if (value !== null && typeof value === 'object' && Object.keys(value).length === 1) {
          // Handle special operators like '<', '>', 'in', etc.
          const operator = Object.keys(value)[0];
          const operatorValue = value[operator];

          if (operator === '<') {
            query = query.where(key, '<', operatorValue);
          } else if (operator === '>') {
            query = query.where(key, '>', operatorValue);
          } else if (operator === '<=') {
            query = query.where(key, '<=', operatorValue);
          } else if (operator === '>=') {
            query = query.where(key, '>=', operatorValue);
          } else if (operator === '!=') {
            query = query.where(key, '!=', operatorValue);
          } else if (operator === 'in') {
            query = query.whereIn(key, operatorValue);
          } else if (operator === 'not in') {
            query = query.whereNotIn(key, operatorValue);
          } else if (operator === 'like') {
            query = query.where(key, 'like', operatorValue);
          } else {
            // Default to equality for unknown operators
            query = query.where(key, value);
          }
        } else {
          // Standard equality condition
          query = query.where(key, value);
        }
      });
    }

    // Apply order by
    if (options.orderBy) {
      const direction = (options.order || 'asc').toLowerCase();
      query = query.orderBy(options.orderBy, direction);
    }

    // Apply limit
    if (options.limit) {
      query = query.limit(options.limit);
    }

    // Apply offset
    if (options.offset) {
      query = query.offset(options.offset);
    }

    const results = await query;
    console.log(`[findWhere] Found ${results?.length || 0} records in ${table}`);

    return (results || []) as T[];
  } catch (error) {
    console.error(`[findWhere] Error querying ${table}:`, error);
    throw error;
  }
}
