import logger from '../../../../../services/logger.js';
import DbService from '../../../../../services/dbService.js';
import { withDatabaseOperation } from '../alerts/errorHandler.js';

/**
 * Unified database operations for chat functionality
 * Consolidates common patterns and provides standardized interfaces
 */
export class ChatDatabaseOperations {
  
  /**
   * Insert a chat message with standardized validation and error handling
   * @param {string} conversationId - Conversation ID
   * @param {Object} messageData - Message data
   * @returns {Promise<Object>} - Inserted message
   */
  static async insertMessage(conversationId, messageData) {
    return withDatabaseOperation(async () => {
      // Validate required fields
      this.validateMessageData(conversationId, messageData);

      // Prepare message for insertion
      const preparedMessage = this.prepareMessageForInsert(conversationId, messageData);
      
      // Insert message
      const insertedMessage = await DbService.create('chat_messages', preparedMessage);
      
      // Update conversation timestamp
      await this.updateConversationTimestamp(conversationId);
      
      return this.formatMessageOutput(insertedMessage);
    }, 'insert', 'message', messageData.id);
  }

  /**
   * Update a chat message with thread consistency handling
   * @param {string} conversationId - Conversation ID
   * @param {string} messageId - Message ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} - Updated message
   */
  static async updateMessage(conversationId, messageId, updateData) {
    return withDatabaseOperation(async () => {
      // Validate message exists and belongs to conversation
      const existingMessage = await this.validateMessageExists(conversationId, messageId);
      
      // Handle thread cleanup if content changed
      if (updateData.content && existingMessage.content !== updateData.content) {
        await this.cleanupMessageThread(conversationId, messageId, existingMessage.created_at);
      }

      // Prepare update data
      const preparedUpdate = this.prepareMessageForUpdate(updateData);
      
      // Update message
      const updatedMessage = await DbService.update('chat_messages', messageId, preparedUpdate);
      
      // Update conversation timestamp
      await this.updateConversationTimestamp(conversationId);
      
      return this.formatMessageOutput(updatedMessage);
    }, 'update', 'message', messageId);
  }

  /**
   * Get conversation with messages
   * @param {string} conversationId - Conversation ID
   * @param {Object} [options] - Query options
   * @returns {Promise<Object>} - Conversation with messages
   */
  static async getConversationWithMessages(conversationId, options = {}) {
    return withDatabaseOperation(async () => {
      const { limit, offset, includeDeleted = false } = options;
      
      // Get conversation
      const conversation = await DbService.getById('conversations', conversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      // Build query conditions
      const conditions = { conversation_id: conversationId };
      if (!includeDeleted) {
        conditions.deleted_at = null;
      }

      // Get messages
      let messages;
      if (limit || offset) {
        messages = await DbService.getPaginated('chat_messages', {
          where: conditions,
          limit,
          offset,
          orderBy: 'created_at ASC'
        });
      } else {
        messages = await DbService.getWhere('chat_messages', conditions);
        messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      }

      return {
        ...conversation,
        messages: messages.map(msg => this.formatMessageOutput(msg)),
        message_count: messages.length
      };
    }, 'get', 'conversation', conversationId);
  }

  /**
   * Batch insert messages
   * @param {string} conversationId - Conversation ID
   * @param {Array<Object>} messagesData - Array of message data
   * @returns {Promise<Array>} - Inserted messages
   */
  static async batchInsertMessages(conversationId, messagesData) {
    return withDatabaseOperation(async () => {
      const insertedMessages = [];
      
      for (const messageData of messagesData) {
        const preparedMessage = this.prepareMessageForInsert(conversationId, messageData);
        const insertedMessage = await DbService.create('chat_messages', preparedMessage);
        insertedMessages.push(this.formatMessageOutput(insertedMessage));
      }
      
      // Update conversation timestamp once at the end
      await this.updateConversationTimestamp(conversationId);
      
      return insertedMessages;
    }, 'batch insert', 'messages');
  }

  // Private helper methods
  
  static validateMessageData(conversationId, messageData) {
    if (!conversationId) {
      throw new Error('Conversation ID is required');
    }
    if (!messageData.content || !messageData.role) {
      throw new Error('Message content and role are required');
    }
  }

  static prepareMessageForInsert(conversationId, messageData) {
    return {
      id: messageData.id,
      conversation_id: conversationId,
      role: messageData.role,
      content: messageData.content,
      user_id: messageData.user_id || null,
      parent_message_id: messageData.parent_message_id || null,
      created_at: messageData.created_at || new Date().toISOString(),
      edited_at: messageData.edited_at || null,
      metadata: messageData.metadata ? JSON.stringify(messageData.metadata) : null
    };
  }

  static prepareMessageForUpdate(updateData) {
    const prepared = {
      ...updateData,
      edited_at: new Date().toISOString()
    };

    if (prepared.metadata && typeof prepared.metadata === 'object') {
      prepared.metadata = JSON.stringify(prepared.metadata);
    }

    return prepared;
  }

  static formatMessageOutput(message) {
    return {
      id: message.id,
      conversation_id: message.conversation_id,
      role: message.role,
      content: message.content,
      user_id: message.user_id,
      parent_message_id: message.parent_message_id,
      created_at: message.created_at,
      edited_at: message.edited_at,
      metadata: message.metadata ? JSON.parse(message.metadata) : null
    };
  }

  static async validateMessageExists(conversationId, messageId) {
    const messages = await DbService.query(`
      SELECT * FROM chat_messages 
      WHERE id = ? AND conversation_id = ?
    `, [messageId, conversationId]);

    if (!messages || messages.length === 0) {
      throw new Error('Message not found in conversation');
    }

    return messages[0];
  }

  static async cleanupMessageThread(conversationId, messageId, messageTimestamp) {
    const subsequentMessages = await DbService.query(`
      SELECT id FROM chat_messages 
      WHERE conversation_id = ? 
      AND created_at > ? 
      AND id != ?
      ORDER BY created_at ASC
    `, [conversationId, messageTimestamp, messageId]);

    if (subsequentMessages.length > 0) {
      const messageIds = subsequentMessages.map(msg => msg.id);
      await DbService.query(`
        DELETE FROM chat_messages 
        WHERE id IN (${messageIds.map(() => '?').join(',')})
      `, messageIds);
      
      logger.info(`Cleaned up ${subsequentMessages.length} subsequent messages`);
    }
  }

  static async updateConversationTimestamp(conversationId) {
    await DbService.update('conversations', conversationId, {
      updated_at: new Date().toISOString()
    });
  }

  /**
   * Get conversation summary/metadata
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<Object>} - Conversation summary
   */
  static async getConversationSummary(conversationId) {
    return withDatabaseOperation(async () => {
      const conversation = await DbService.getById('conversations', conversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      // Get message statistics
      const messageStats = await DbService.query(`
        SELECT 
          COUNT(*) as total_messages,
          COUNT(CASE WHEN role = 'user' THEN 1 END) as user_messages,
          COUNT(CASE WHEN role = 'assistant' THEN 1 END) as assistant_messages,
          MIN(created_at) as first_message_at,
          MAX(created_at) as last_message_at
        FROM chat_messages 
        WHERE conversation_id = ?
      `, [conversationId]);

      const stats = messageStats[0] || {};

      return {
        id: conversation.id,
        user_id: conversation.user_id,
        assessment_id: conversation.assessment_id,
        assessment_pattern: conversation.assessment_pattern,
        created_at: conversation.created_at,
        updated_at: conversation.updated_at,
        statistics: {
          total_messages: stats.total_messages || 0,
          user_messages: stats.user_messages || 0,
          assistant_messages: stats.assistant_messages || 0,
          first_message_at: stats.first_message_at,
          last_message_at: stats.last_message_at
        }
      };
    }, 'get', 'conversation summary', conversationId);
  }
} 