// ===================================
// CHAT MODEL - MAIN EXPORTS
// ===================================
// This file provides a unified interface to all chat functionality
// organized according to the new modular structure

// ===================================
// ENTITY MODELS
// ===================================
export { Message } from './message/message.js';
export { Conversation } from './conversation/conversation.js';

// ===================================
// CONVERSATION OPERATIONS
// ===================================
export { getUserConversations } from './list/chatGetList.js';
export { deleteConversation } from './conversation/delete-conversation/chatDelete.js';

export { 
  createAssessmentConversation
} from './conversation/create-new-conversation/createFlow.js';

export { 
  getConversation,
  getConversationForUser,
  getConversationSummary
} from './conversation/read-conversation/getConversation.js';

// ===================================
// MESSAGE OPERATIONS
// ===================================
export { 
  sendMessage
} from './message/user-message/add-message/sendUserMessage.js';

// ===================================
// CONVENIENCE FUNCTIONS
// ===================================

/**
 * Quick conversation starter - creates conversation and sends first message
 * @param {string} userId - User ID
 * @param {string} message - First message
 * @param {string} [assessmentId] - Optional assessment ID
 * @returns {Promise<Object>} - Complete conversation with initial exchange
 */
export const quickStart = async (userId, message, assessmentId = null) => {
  const { createAssessmentConversation } = await import('./conversation/create-new-conversation/createFlow.js');
  return await createAssessmentConversation(userId, assessmentId);
};

/**
 * Send message and get response in one call
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID
 * @param {string} message - Message to send
 * @returns {Promise<Object>} - Message exchange result
 */
export const sendAndRespond = async (conversationId, userId, message) => {
  const { sendMessage } = await import('./message/user-message/add-message/sendUserMessage.js');
  return await sendMessage(conversationId, userId, message);
};

// ===================================
// BACKWARD COMPATIBILITY
// ===================================
// Re-export legacy function names for backward compatibility

export { getUserConversations as getConversations };
export { createAssessmentConversation as createConversation };
export { createAssessmentConversation as newConversation };
export { getConversation as readConversation };
export { sendMessage as sendMessageNew };

// Legacy Chat class alias for backward compatibility
export { Conversation as Chat };

// ===================================
// TYPE DEFINITIONS (for JSDoc)
// ===================================

/**
 * @typedef {Object} ConversationSummary
 * @property {string} id - Conversation ID
 * @property {string} user_id - User ID
 * @property {string} assessment_id - Assessment ID
 * @property {string} assessment_pattern - Assessment pattern
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 * @property {Object} statistics - Conversation statistics
 */

/**
 * @typedef {Object} MessageExchange
 * @property {Object} userMessage - User message object
 * @property {Object} assistantMessage - Assistant response object
 * @property {string} conversationId - Conversation ID
 * @property {string} timestamp - Exchange timestamp
 */ 