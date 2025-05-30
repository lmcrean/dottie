// ===================================
// CHAT MODEL - MAIN EXPORTS
// ===================================
// This file provides a unified interface to all chat functionality
// organized according to the new modular structure

// ===================================
// IMPORTS
// ===================================
import { Message as OriginalMessage } from './message/message.js';
import { Conversation as OriginalConversation } from './conversation/conversation.js';
import { getUserConversations as originalGetUserConversations } from './list/chatGetList.js';
import { deleteConversation as originalDeleteConversation } from './conversation/delete-conversation/chatDelete.js';
import { createAssessmentConversation as originalCreateAssessmentConversation } from './conversation/create-new-conversation/createFlow.js';
import { getConversation as originalGetConversation, getConversationForUser as originalGetConversationForUser, getConversationSummary as originalGetConversationSummary } from './conversation/read-conversation/getConversation.js';
import { addUserMessage as originalAddUserMessage, sendMessage as originalSendMessage } from './message/1-user-message/add-message/sendUserMessage.js';
import { insertChatMessage as originalInsertChatMessage } from './message/1-user-message/add-message/database/sendUserMessage.js';
import { generateAndSaveResponse as originalGenerateAndSaveResponse } from './message/2-chatbot-message/generateResponse.js';
import { sendChatbotMessage as originalSendChatbotMessage } from './message/2-chatbot-message/database/sendChatbotMessage.js';
import { updateConversationAssessmentLinks as originalUpdateConversationAssessmentLinks } from './conversation/update-conversation/updateAssessmentLinks.js';

// TEMPORARY: Comment out sendMessageFlow import to fix initialization issue
// import { sendMessageFlow as importedSendMessageFlow } from './message/send-message-flow/sendMessageFlow.js';

// ===================================
// ENTITY MODELS
// ===================================
export const Message = OriginalMessage;
// OriginalConversation is aliased as Chat below

// ===================================
// CONVERSATION OPERATIONS
// ===================================
export const getUserConversations = originalGetUserConversations;
export const deleteConversation = originalDeleteConversation;
export const createAssessmentConversation = originalCreateAssessmentConversation;
export const getConversation = originalGetConversation;
export const getConversationForUser = originalGetConversationForUser;
export const getConversationSummary = originalGetConversationSummary;
export const updateConversationAssessmentLinks = originalUpdateConversationAssessmentLinks;

// ===================================
// MESSAGE OPERATIONS - NEW CLEAN STRUCTURE
// ===================================
// 1. User Message Operations
export const addUserMessage = originalAddUserMessage;
export const insertChatMessage = originalInsertChatMessage;

// 2. Chatbot Message Operations  
export const generateAndSaveResponse = originalGenerateAndSaveResponse;
export const sendChatbotMessage = originalSendChatbotMessage;

// 3. Complete Message Flow (orchestrator) - TEMPORARILY DISABLED
// export const sendMessageFlow = importedSendMessageFlow;

// ===================================
// CONVENIENCE FUNCTIONS - TEMPORARILY DISABLED
// ===================================

/*
export const quickStart = async (userId, message, assessmentId = null) => {
  return await importedSendMessageFlow(userId, message, null, assessmentId);
};

export const sendAndRespond = async (conversationId, userId, message) => {
  return await importedSendMessageFlow(userId, message, conversationId);
};
*/

// ===================================
// BACKWARD COMPATIBILITY
// ===================================
// Re-export legacy function names for backward compatibility

export const getConversations = originalGetUserConversations;

// Fixed wrapper for createConversation that returns just the ID string
/**
 * Create a conversation and return just the ID as a string
 * @param {string} userId - User ID
 * @param {string} assessmentId - Assessment ID
 * @returns {Promise<string>} Conversation ID as a string
 */
export const createConversation = async (userId, assessmentId) => {
  // Call the original function
  const result = await originalCreateAssessmentConversation(userId, assessmentId);
  
  // Log what we're receiving from createAssessmentConversation
  console.log(`[createConversation-wrapper] Received result from createAssessmentConversation:`, {
    resultType: typeof result,
    hasConversationId: result && result.conversationId ? 'yes' : 'no',
    conversationIdType: result && result.conversationId ? typeof result.conversationId : 'n/a'
  });
  
  // Extract and return just the ID as a string
  if (result && result.conversationId) {
    const idString = String(result.conversationId);
    console.log(`[createConversation-wrapper] Returning ID string: ${idString}`);
    return idString;
  } 
  
  // Handle error case
  console.error(`[createConversation-wrapper] Invalid result format:`, result);
  throw new Error('Failed to get valid conversation ID from createAssessmentConversation');
};

export const newConversation = originalCreateAssessmentConversation;
export const readConversation = originalGetConversation;
export const sendMessage = originalSendMessage; // Legacy: only adds user message
// export const sendMessageNew = importedSendMessageFlow; // Legacy: complete flow - TEMPORARILY DISABLED

// Legacy Chat class alias for backward compatibility
export const Chat = OriginalConversation;

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