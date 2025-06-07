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
    if (table === 'conversations' && updateData.preview) {
      console.log(`[updateWhere] Updating conversation preview: "${updateData.preview.substring(0, 30)}..."`);
    }
    
    // Handle date objects for Supabase compatibility
    const processedUpdateData = { ...updateData };
    Object.entries(processedUpdateData).forEach(([key, value]) => {
      if (value instanceof Date) {
        processedUpdateData[key] = value.toISOString();
        console.log(`[updateWhere] Converted date for ${key} to ISO string: ${processedUpdateData[key]}`);
      }
    });
    
    // Determine if we're using Supabase or SQLite
    const isSupabase = db.client?.config?.client === 'supabase';
    console.log(`[updateWhere] Database type: ${isSupabase ? 'Supabase' : 'SQLite'}`);
    
    // Perform the update
    let result;
    let updatedRecords;
    
    if (isSupabase) {
      try {
        console.log(`[updateWhere] Using Supabase-specific update approach`);
        
        // Start with the table
        let query = db(table);
        
        // Apply each where condition separately instead of passing the whole object
        if (whereCondition && typeof whereCondition === 'object') {
          Object.entries(whereCondition).forEach(([key, value]) => {
            console.log(`[updateWhere] Adding Supabase where condition: ${key} = ${value}`);
            // Add each condition separately
            query = query.where(key, value);
          });
        }
        
        // Apply the update
        query = query.update(processedUpdateData);
        
        // Execute the query
        result = await query;
        console.log(`[updateWhere] Supabase update complete, result:`, result ? JSON.stringify(result) : 'No result data');
        
        // Fetch the updated records using the same where conditions
        let selectQuery = db(table);
        Object.entries(whereCondition).forEach(([key, value]) => {
          selectQuery = selectQuery.where(key, value);
        });
        updatedRecords = await selectQuery;
      } catch (supabaseError) {
        console.error(`[updateWhere] Supabase update error:`, supabaseError);
        throw supabaseError;
      }
    } else {
      // For SQLite and other database systems
      result = await db(table).where(whereCondition).update(processedUpdateData);
      console.log(`[updateWhere] Standard update complete, affected rows: ${result}`);
      
      // Fetch the updated data to return
      updatedRecords = await db(table).where(whereCondition).select('*');
    }
    
    console.log(`[updateWhere] Successfully fetched ${updatedRecords?.length || 0} updated records`);
    
    return updatedRecords || [];
  } catch (error) {
    console.error(`[updateWhere] Error updating ${table}:`, error);
    logger.error(`Error updating ${table}:`, error);
    throw error;
  }
} 