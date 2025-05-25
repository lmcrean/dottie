import { v4 as uuidv4 } from 'uuid';
import DbService from '../../../services/dbService.js';
import logger from '../../../services/logger.js';

/**
 * Insert a chat message into the database
 * @param {string} conversationId - Conversation ID
 * @param {Object} message - Message object with role and content
 * @returns {Promise<boolean>} - Success indicator
 */
export const insertChatMessage = async (conversationId, message) => {
  try {
    const messageId = uuidv4();
    const now = new Date().toISOString();
    
    // Insert the message
    await DbService.create('chat_messages', {
      id: messageId,
      conversation_id: conversationId,
      role: message.role,
      content: message.content,
      created_at: now
    });
    
    // Update conversation's updated_at time
    await DbService.update('conversations', conversationId, {
      updated_at: now
    });
    
    return true;
  } catch (error) {
    logger.error('Error inserting chat message:', error);
    throw error;
  }
}; 