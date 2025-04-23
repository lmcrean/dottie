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
      userId: userId,
      createdAt: now,
      updatedAt: now
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
      createdAt: now
    });
    
    // Update conversation's updatedAt time
    await DbService.update('conversations', conversationId, {
      updatedAt: now
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

    if (!conversation || conversation.length === 0 || conversation[0].userId !== userId) {
      return null;
    }
    
    // Get all messages for this conversation
    const messages = await DbService.findBy('chat_messages', 'conversation_id', conversationId);
    
    return {
      // ...conversation[0],
      // userId: conversation[0].userId,
      // createdAt: conversation[0].createdAt,
      // updatedAt: conversation[0].updatedAt,
      id: conversationId,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt
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
    const conversations = await DbService.getConversationsWithPreviews(userId);
    
    return conversations.map(conversation => ({
      id: conversation.id,
      lastMessageDate: conversation.lastMessageDate,
      preview: conversation.preview 
        ? conversation.preview + (conversation.preview.length >= 50 ? '...' : '')
        : 'No messages yet'
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
    const conversations = await DbService.findBy('conversations', 'id', conversationId);
    
    // Check if conversation exists and belongs to user
    if (!conversations || conversations.length === 0) {
      logger.warn(`Conversation ${conversationId} not found`);
      return false;
    }

    const conversation = conversations[0];
    if (conversation.userId !== userId) {
      logger.warn(`User ${userId} not authorized to delete conversation ${conversationId}`);
      return false;
    }

    // Delete all messages first (due to foreign key constraint)
    const messagesDeleted = await DbService.delete('chat_messages', {
      conversation_id: conversationId
    });
    logger.info(`Deleted ${messagesDeleted} messages from conversation ${conversationId}`);

    // Delete the conversation
    const conversationDeleted = await DbService.delete('conversations', {
      id: conversationId,
      userId: userId  // Extra safety: ensure user owns the conversation
    });

    if (!conversationDeleted) {
      logger.error(`Failed to delete conversation ${conversationId}`);
      return false;
    }

    logger.info(`Successfully deleted conversation ${conversationId}`);
    return true;

  } catch (error) {
    logger.error('Error deleting conversation:', error);
    throw error;
  }
}; 