import { db } from '../db/index.js';

/**
 * Database service for common operations
 */
class DbService {
  /**
   * Find a record by ID
   * @param {string} table - Table name
   * @param {string|number} id - Record ID
   * @returns {Promise<object|null>} - Found record or null
   */
  static async findById(table, id) {
    try {
      const record = await db(table)
        .where('id', id)
        .first();

      return record || null;
    } catch (error) {
      console.error(`Error in findById for ${table}:`, error);
      throw error;
    }
  }

  /**
   * Find records by a field value
   * @param {string} table - Table name
   * @param {string} field - Field name
   * @param {any} value - Field value
   * @returns {Promise<Array>} - Array of found records
   */
  static async findBy(table, field, value) {
    try {
      const records = await db(table)
        .where(field, value);

      return records || [];
    } catch (error) {
      console.error(`Error in findBy for ${table}:`, error);
      throw error;
    }
  }

  /**
   * Create a new record
   * @param {string} table - Table name
   * @param {object} data - Record data
   * @returns {Promise<object>} - Created record
   */
  static async create(table, data) {
    try {
      const [id] = await db(table)
        .insert(data);

      // For SQLite compatibility, fetch the record after insertion
      const insertedRecord = await this.findById(table, data.id || id);
      return insertedRecord;
    } catch (error) {
      console.error(`Error in create for ${table}:`, error);
      throw error;
    }
  }

  /**
   * Update a record
   * @param {string} table - Table name
   * @param {string|number} id - Record ID
   * @param {object} data - Update data
   * @returns {Promise<object>} - Updated record
   */
  static async update(table, id, data) {
    try {
      await db(table)
        .where('id', id)
        .update(data);

      // For compatibility, fetch the updated record
      const updatedRecord = await this.findById(table, id);
      return updatedRecord;
    } catch (error) {
      console.error(`Error in update for ${table}:`, error);
      throw error;
    }
  }

  /**
   * Delete record(s) from a table
   * @param {string} table - Table name
   * @param {string|number|Object} option - Record ID or conditions object
   * @returns {Promise<boolean>} - Success flag
   */
  static async delete(table, option) {
    try {
      let query = db(table);

      if (typeof option === 'object' && option !== null) {
        // Handle each condition in the object
        Object.entries(option).forEach(([key, value]) => {
          query = query.where(key, value);
        });
      } else {
        // Simple ID-based deletion
        query = query.where('id', option);
      }

      const count = await query.delete();
      return count > 0;
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
      throw error;
    }
  }

  /**
   * Get all records from a table
   * @param {string} table - Table name
   * @returns {Promise<Array>} - Array of records
   */
  static async getAll(table) {
    try {
      const records = await db(table).select('*');
      return records || [];
    } catch (error) {
      console.error(`Error in getAll for ${table}:`, error);
      throw error;
    }
  }

  /**
   * Get conversations with their latest message preview
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Conversations with previews
   */
  static async getConversationsWithPreviews(userId) {
    try {
      // Get all conversations for the user
      const conversations = await db('conversations')
        .where('user_id', userId)
        .orderBy('updated_at', 'desc');

      // For each conversation, get the latest message
      const conversationsWithPreviews = await Promise.all(
        (conversations || []).map(async (conv) => {
          const latestMessage = await db('chat_messages')
            .where('conversation_id', conv.id)
            .orderBy('created_at', 'desc')
            .first();

          return {
            id: conv.id,
            lastMessageDate: conv.updated_at,
            preview: latestMessage
              ? latestMessage.content.substring(0, 50)
              : ''
          };
        })
      );

      return conversationsWithPreviews;
    } catch (error) {
      console.error(`Error in getConversationsWithPreviews:`, error);
      throw error;
    }
  }


  /**
   * Create a new record with JSON fields auto-stringified
   * @param {string} table - Table name
   * @param {object} data - Record data
   * @param {Array<string>} jsonFields - Fields to stringify
   * @returns {Promise<object>} - Created record
   */
  static async createWithJson(table, data, jsonFields = []) {
    try {
      const preparedData = { ...data };

      for (const field of jsonFields) {
        if (preparedData[field] !== undefined) {
          preparedData[field] = JSON.stringify(preparedData[field]);
        }
      }

      const [id] = await db(table).insert(preparedData);

      const insertedRecord = await this.findById(table, data.id || id);

      // Auto-parse JSON fields
      for (const field of jsonFields) {
        if (insertedRecord?.[field]) {
          try {
            insertedRecord[field] = JSON.parse(insertedRecord[field]);
          } catch (err) {
            console.warn(`Failed to parse field ${field} in ${table}:`, err);
          }
        }
      }

      return insertedRecord;
    } catch (error) {
      console.error(`Error in createWithJson for ${table}:`, error);
      throw error;
    }
  }

  /**
 * Find a record by ID and auto-parse JSON fields
 * @param {string} table - Table name
 * @param {string|number} id - Record ID
 * @param {Array<string>} jsonFields - Fields to auto-parse
 * @returns {Promise<object|null>} - Found record or null
 */
  static async findByIdWithJson(table, id, jsonFields = []) {
    const record = await this.findById(table, id);

    if (!record) return null;

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
  }


  /**
 * Find many records by field and parse JSON fields
 * @param {string} table - Table name
 * @param {string} field - Field to match
 * @param {any} value - Value to match
 * @param {Array<string>} jsonFields - Fields to auto-parse
 * @param {string} [orderBy] - Optional order field
 * @returns {Promise<Array>} - Matching records
 */
  static async findByFieldWithJson(table, field, value, jsonFields = [], orderBy = null) {
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


  /**
 * Update records with JSON fields
 * @param {string} table - Table name
 * @param {string|number} id - Record ID
 * @param {any} data - update data to match
 * @param {Array<string>} jsonFields - Fields to auto-parse
 * @returns {Promise<Array>} - Matching records
 */
  static async updateWithJson(table, id, data, jsonFields = []) {
    const preparedData = { ...data };
    for (const field of jsonFields) {
      if (preparedData[field] !== undefined) {
        preparedData[field] = JSON.stringify(preparedData[field]);
      }
    }
    await this.update(table, id, preparedData);
    return await this.findByIdWithJson(table, id, jsonFields);
  }


}

export default DbService; 