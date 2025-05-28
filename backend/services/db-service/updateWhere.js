import { db } from '../../db/index.js';
import logger from '../logger.js';

/**
 * Update records in a table based on a where condition
 * @param {string} table - Table name
 * @param {object} whereCondition - Condition to match records to update
 * @param {object} updateData - Data to update
 * @returns {Promise<Array>} - Updated records
 */
export async function updateWhere(table, whereCondition, updateData) {
  try {
    // Enhanced logging for the update operation
    console.log(`[updateWhere] Starting update operation for table: ${table}`);
    console.log(`[updateWhere] whereCondition:`, JSON.stringify(whereCondition));
    console.log(`[updateWhere] updateData:`, JSON.stringify(updateData));
    
    // Additional logging for preview updates
    if (table === 'conversations' && updateData.preview !== undefined) {
      console.log(`[updateWhere] Updating conversation preview: "${updateData.preview.substring(0, 30)}${updateData.preview.length > 30 ? '...' : ''}"`);
      console.log(`[updateWhere] Preview update for conversation ID: ${whereCondition.id}`);
    }
    
    // Ensure whereCondition is properly formatted for Supabase/PostgreSQL
    // The issue occurs when complex objects are passed in the whereCondition
    // We need to ensure we're using simple key-value pairs
    
    // Log the raw whereCondition for debugging
    logger.debug(`[updateWhere] Raw whereCondition for ${table}:`, JSON.stringify(whereCondition));
    
    // Start building the query
    let query = db(table);
    
    // Apply where conditions - handle each key separately to avoid object serialization issues
    if (whereCondition && typeof whereCondition === 'object') {
      Object.entries(whereCondition).forEach(([key, value]) => {
        // Apply each condition individually with proper formatting
        console.log(`[updateWhere] Adding where condition: ${key} = ${value}`);
        query = query.where(key, value);
      });
    }
    
    // Apply the update
    console.log(`[updateWhere] Applying update to ${table}`);
    query = query.update(updateData);
    
    // Check if returning is supported (SQLite doesn't support it, Supabase/PostgreSQL does)
    try {
      if (typeof query.returning === 'function') {
        console.log(`[updateWhere] Using returning clause for ${table}`);
        const result = await query.returning('*');
        console.log(`[updateWhere] Update result for ${table}:`, result ? `Success, returned ${result.length} rows` : 'No data returned');
        return result;
      } else {
        // For databases that don't support returning, just run the update
        console.log(`[updateWhere] No returning support detected, executing basic update for ${table}`);
        await query;
        
        // Then fetch the updated record(s) in a separate query
        console.log(`[updateWhere] Fetching updated records for ${table}`);
        let selectQuery = db(table);
        
        // Apply the same where conditions to the select query
        if (whereCondition && typeof whereCondition === 'object') {
          Object.entries(whereCondition).forEach(([key, value]) => {
            selectQuery = selectQuery.where(key, value);
          });
        }
        
        const result = await selectQuery.select('*');
        console.log(`[updateWhere] Retrieved updated records for ${table}:`, result ? `Success, returned ${result.length} rows` : 'No data returned');
        return result;
      }
    } catch (returningError) {
      // If returning fails for any reason, fall back to just updating without returning
      console.error(`[updateWhere] Error with returning clause for ${table}:`, returningError);
      logger.warn(`[updateWhere] Returning not supported, falling back to basic update: ${returningError.message}`);
      
      // Execute the update without returning
      console.log(`[updateWhere] Executing fallback update for ${table}`);
      let fallbackQuery = db(table);
      
      // Apply where conditions again
      if (whereCondition && typeof whereCondition === 'object') {
        Object.entries(whereCondition).forEach(([key, value]) => {
          fallbackQuery = fallbackQuery.where(key, value);
        });
      }
      
      await fallbackQuery.update(updateData);
      console.log(`[updateWhere] Fallback update completed for ${table} without returning data`);
      return [];
    }
  } catch (error) {
    console.error(`[updateWhere] ERROR updating ${table}:`, error);
    logger.error(`[updateWhere] Error updating ${table} with condition:`, JSON.stringify(whereCondition), error);
    throw error;
  }
} 