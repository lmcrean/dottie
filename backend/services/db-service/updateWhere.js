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
    if (isSupabase) {
      // For Supabase, add a .select() call to get the updated data
      let query = db(table).where(whereCondition).update(processedUpdateData);
      result = await query;
      console.log(`[updateWhere] Supabase update complete, result:`, JSON.stringify(result));
    } else {
      // For SQLite and other database systems
      result = await db(table).where(whereCondition).update(processedUpdateData);
      console.log(`[updateWhere] Standard update complete, affected rows: ${result}`);
    }
    
    // Fetch the updated data to return (important for the calling function)
    const updatedRecords = await db(table).where(whereCondition).select('*');
    console.log(`[updateWhere] Successfully fetched ${updatedRecords.length} updated records`);
    
    return updatedRecords;
  } catch (error) {
    console.error(`[updateWhere] Error updating ${table}:`, error);
    logger.error(`Error updating ${table}:`, error);
    throw error;
  }
} 