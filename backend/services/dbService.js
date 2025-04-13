import supabase from './supabaseService.js';

/**
 * Database service for common operations using Supabase
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
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data || null;
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
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq(field, value);
      
      if (error) throw error;
      return data || [];
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
      const { data: insertedData, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return insertedData;
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
      const { data: updatedData, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedData;
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
      let query = supabase.from(table);

      if (typeof option === 'object' && option !== null) {
        // Handle each condition in the object
        Object.entries(option).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      } else {
        // Simple ID-based deletion
        query = query.eq('id', option);
      }

      const { error, count } = await query.delete().select('count');
      
      if (error) throw error;
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
      const { data, error } = await supabase
        .from(table)
        .select('*');
      
      if (error) throw error;
      return data || [];
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
      // For Supabase, we need to use a more basic approach or stored functions
      // First get all conversations for the user
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('id, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
      
      if (convError) throw convError;
      
      // For each conversation, get the latest message
      const conversationsWithPreviews = await Promise.all(
        (conversations || []).map(async (conv) => {
          const { data: messages, error: msgError } = await supabase
            .from('chat_messages')
            .select('content, created_at')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1);
          
          if (msgError) throw msgError;
          
          return {
            id: conv.id,
            lastMessageDate: conv.updated_at,
            preview: messages && messages.length > 0
              ? messages[0].content.substring(0, 50)
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
}

export default DbService; 