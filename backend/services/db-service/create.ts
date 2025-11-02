import { db } from '../../db/index.js';
import { findById } from './findById.js';
import { DbRecord, PartialDbRecord } from './types.js';

/**
 * Create a new record
 * @param table - Table name
 * @param data - Record data
 * @returns Created record
 */
export async function create<T extends DbRecord = DbRecord>(
  table: string,
  data: PartialDbRecord
): Promise<T> {
  try {
    // Log entry point (don't spread data - causes "(intermediate value) is not iterable" error)
    console.log(`[DbService.create] Creating record in ${table} with data:`, {
      data: data,
      id_type: data?.id ? typeof data.id : 'undefined',
      conversation_id_type: data?.conversation_id ? typeof data.conversation_id : 'undefined'
    });

    // Validate data before spreading (prevent "(intermediate value) is not iterable" error)
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data provided to create()');
    }

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

    // Filter out undefined values to prevent NULL being inserted
    // This allows database defaults (like gen_random_uuid() for id) to work
    const cleanedData = Object.fromEntries(
      Object.entries(sanitizedData).filter(([_, value]) => value !== undefined)
    );

    // Prepare parameters for SQL execution
    const parameters = Object.values(cleanedData);

    // Log SQL parameters
    console.log(`[DbService.create] Executing SQL with parameters:`, parameters);

    // Use returning() for PostgreSQL compatibility
    // SQLite returns [id], PostgreSQL needs .returning() to return data
    const result = await db(table)
      .insert(cleanedData)
      .returning('*');

    // PostgreSQL returns an array of objects, SQLite returns an array of IDs
    const id = result[0]?.id || result[0] || sanitizedData.id;

    // Log successful insertion
    console.log(`[DbService.create] Successfully inserted record in ${table} with ID: ${sanitizedData.id || id}`);

    // For SQLite compatibility, fetch the record after insertion
    const insertedRecord = await findById<T>(table, sanitizedData.id || id);
    return insertedRecord as T;
  } catch (error) {
    console.error(`Error in create for ${table}:`, error);
    throw error;
  }
}
