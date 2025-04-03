import { v4 as uuidv4 } from 'uuid';
import DbService from '../services/dbService.js';
import logger from '../services/logger.js';

/**
 * Create a new conversation in the database
 * @param {string} userId - User ID who owns this conversation
 * @returns {Promise<string>} - Conversation ID
 */
export const createConversation = async (userId) => {
  try {
    const conversationId = uuidv4();
    const now = new Date().toISOString();
    
    await DbService.create('conversations', {
      id: conversationId,
      user_id: userId,
      created_at: now,
      updated_at: now
    });
    
    return conversationId;
  } catch (error) {
    logger.error('Error creating conversation:', error);
    throw error;
  }
};

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

/**
 * Get a conversation and its messages by ID
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID to verify ownership
 * @returns {Promise<Object|null>} - Conversation with messages
 */
export const getConversation = async (conversationId, userId) => {
  try {
    // First check if the conversation exists and belongs to the user
    const conversation = await DbService.findBy('conversations', 'id', conversationId);
    
    if (!conversation || conversation.length === 0 || conversation[0].user_id !== userId) {
      return null;
    }
    
    // Get all messages for this conversation
    const messages = await DbService.findBy('chat_messages', 'conversation_id', conversationId);
    
    return {
      ...conversation[0],
      userId: conversation[0].user_id,
      createdAt: conversation[0].created_at,
      updatedAt: conversation[0].updated_at,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        createdAt: msg.created_at
      }))
    };
  } catch (error) {
    logger.error('Error getting conversation:', error);
    throw error;
  }
};

/**
 * Get all conversations for a user (with preview of last message)
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - List of conversations
 */
export const getUserConversations = async (userId) => {
  try {
    // Get all conversations
    const conversations = await DbService.findBy('conversations', 'user_id', userId);
    
    return conversations.map(conversation => ({
      id: conversation.id,
      lastMessageDate: conversation.updated_at,
      preview: conversation.updated_at
    }));
  } catch (error) {
    logger.error('Error getting user conversations:', error);
    throw error;
  }
};

/**
 * Delete a conversation and all its messages
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID to verify ownership
 * @returns {Promise<boolean>} - Success indicator
 */
export const deleteConversation = async (conversationId, userId) => {
  try {
    // First check if the conversation exists and belongs to the user
    const conversation = await DbService.findBy('conversations', 'id', conversationId);
    
    if (!conversation || conversation.length === 0 || conversation[0].user_id !== userId) {
      return false;
    }
    
    // Delete all messages first (due to foreign key constraint)
    await DbService.delete('chat_messages', 'conversation_id', conversationId);
    
    // Delete the conversation
    await DbService.delete('conversations', 'id', conversationId);
    
    return true;
  } catch (error) {
    logger.error('Error deleting conversation:', error);
    throw error;
  }
}; 