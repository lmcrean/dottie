import { db } from '../../db/index.js';
import logger from '../../logger.js';

/**
 * Update records in a table based on a where condition
 * @param {string} table - Table name
 * @param {object} whereCondition - Condition to match records to update
 * @param {object} updateData - Data to update
 * @returns {Promise<Array>} - Updated records
 */
export async function updateWhere(table, whereCondition, updateData) {
  try {
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
        query = query.where(key, value);
      });
    }
    
    // Apply the update
    query = query.update(updateData);
    
    // Check if returning is supported (SQLite doesn't support it, Supabase/PostgreSQL does)
    try {
      if (typeof query.returning === 'function') {
        return await query.returning('*');
      } else {
        // For databases that don't support returning, just run the update
        await query;
        
        // Then fetch the updated record(s) in a separate query
        let selectQuery = db(table);
        
        // Apply the same where conditions to the select query
        if (whereCondition && typeof whereCondition === 'object') {
          Object.entries(whereCondition).forEach(([key, value]) => {
            selectQuery = selectQuery.where(key, value);
          });
        }
        
        return await selectQuery.select('*');
      }
    } catch (returningError) {
      // If returning fails for any reason, fall back to just updating without returning
      logger.warn(`[updateWhere] Returning not supported, falling back to basic update: ${returningError.message}`);
      
      // Execute the update without returning
      let fallbackQuery = db(table);
      
      // Apply where conditions again
      if (whereCondition && typeof whereCondition === 'object') {
        Object.entries(whereCondition).forEach(([key, value]) => {
          fallbackQuery = fallbackQuery.where(key, value);
        });
      }
      
      await fallbackQuery.update(updateData);
      return [];
    }
  } catch (error) {
    logger.error(`[updateWhere] Error updating ${table} with condition:`, JSON.stringify(whereCondition), error);
    throw error;
  }
} 