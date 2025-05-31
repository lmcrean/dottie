import { db } from '../../db/index.js';
import { findById } from './findById.js';

/**
 * Create a new record
 * @param {string} table - Table name
 * @param {object} data - Record data
 * @returns {Promise<object>} - Created record
 */
export async function create(table, data) {
  try {
    // Log entry point
    console.log(`[DbService.create] Creating record in ${table} with data:`, {
      ...data,
      id_type: data.id ? typeof data.id : 'undefined',
      conversation_id_type: data.conversation_id ? typeof data.conversation_id : 'undefined'
    });

    // Create a sanitized copy of the data to avoid modifying the original
    const sanitizedData = { ...data };
    
    // Handle common ID fields that need to be strings
    if (sanitizedData.conversation_id !== undefined) {
      // Ensure conversation_id is a string
      sanitizedData.conversation_id = String(sanitizedData.conversation_id);
      console.log(`[DbService.create] Sanitized conversation_id: ${sanitizedData.conversation_id}, type: ${typeof sanitizedData.conversation_id}`);
    }
    
    if (sanitizedData.user_id !== undefined) {
      // Ensure user_id is a string
      sanitizedData.user_id = String(sanitizedData.user_id);
    }
    
    if (sanitizedData.assessment_id !== undefined) {
      // Ensure assessment_id is a string
      sanitizedData.assessment_id = String(sanitizedData.assessment_id);
    }
    
    // Always ensure id is a string if it exists
    if (sanitizedData.id !== undefined) {
      sanitizedData.id = String(sanitizedData.id);
    }

    // Log sanitized data for debugging
    console.log(`[DbService.create] Creating record in ${table} with sanitized data:`, {
      id: sanitizedData.id,
      id_type: sanitizedData.id ? typeof sanitizedData.id : 'undefined',
      conversation_id: sanitizedData.conversation_id,
      conversation_id_type: sanitizedData.conversation_id ? typeof sanitizedData.conversation_id : 'undefined',
      table
    });

    // Prepare parameters for SQL execution
    const parameters = Object.values(sanitizedData);
    
    // Log SQL parameters
    console.log(`[DbService.create] Executing SQL with parameters:`, parameters);

    const [id] = await db(table)
      .insert(sanitizedData);

    // Log successful insertion
    console.log(`[DbService.create] Successfully inserted record in ${table} with ID: ${sanitizedData.id || id}`);

    // For SQLite compatibility, fetch the record after insertion
    const insertedRecord = await findById(table, sanitizedData.id || id);
    return insertedRecord;
  } catch (error) {
    console.error(`Error in create for ${table}:`, error);
    throw error;
  }
} 