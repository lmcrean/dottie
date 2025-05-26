// ===================================
// CHAT MODEL - MAIN EXPORTS
// ===================================
// This file provides a unified interface to all chat functionality
// organized according to the new modular structure

// ===================================
// CHAT LIST - Browse existing conversations
// ===================================
export { getUserConversations } from './read-chat-list/chatGetList.js';
export { deleteConversation } from './chat-detail/delete-chat-detail/chatDelete.js';
export { Chat as default } from './read-chat-list/chat.js';

// ===================================
// CREATE CONVERSATION - New conversation flow
// ===================================
export { createConversation } from './chat-detail/shared/create-conversation/chatCreate.js';
export { 
  setupAssessmentContext, 
  validateAssessmentContext 
} from './chat-detail/shared/create-conversation/assessmentSetup.js';
export { 
  createInitialMessage, 
  generateInitialResponse, 
  autoTriggerInitialConversation 
} from './chat-detail/shared/create-conversation/initialMessage.js';
export { 
  createCompleteConversation,
  createConversationWithMessage,
  createEmptyConversation,
  createAssessmentConversation
} from './chat-detail/shared/create-conversation/createFlow.js';

// ===================================
// CONTINUE CONVERSATION - Ongoing messages
// ===================================
export { 
  sendMessage,
  editMessage,
  sendMessageOnly,
  sendQuickReply,
  continueWithContext
} from './chat-detail/user-message/add-message/sendMessage.js';
export { 
  generateResponseToMessage,
  generateFollowUpResponse,
  autoGenerateResponse,
  generateResponseOptions
} from './chat-detail/chatbot-message/generateResponse.js';
export { editMessageWithRegeneration } from './chat-detail/user-message/update-message/editMessageWithRegeneration.js';
export { triggerResponse } from './chat-detail/shared/utils/triggerResponse.js';
export { continueConversationWithContext } from './chat-detail/user-message/add-message/continueConversationWithContext.js';

// ===================================
// READ CONVERSATION - Read conversation data
// ===================================
export { 
  getConversationHistory,
  getConversationMessages,
  getRecentMessages,
  getConversationSummary
} from './chat-detail/read-chat-detail/getConversation.js';
export { 
  getConversationWithContext,
  getConversationForDisplay,
  getConversationContextForAI,
  getConversationPreview
} from './chat-detail/read-chat-detail/getWithContext.js';

// ===================================
// SHARED UTILITIES
// ===================================

// Assessment helpers
export { getAssessmentPattern } from './chat-detail/shared/assessment/assessmentHelper.js';
export { 
  validateAssessmentOwnership,
  validateAssessmentExists,
  validateAndGetAssessment,
  validateMultipleAssessments
} from './chat-detail/shared/assessment/assessmentValidator.js';

// Error handling and validation utilities
export { 
  withErrorHandling,
  withValidation,
  withDatabaseOperation,
  withServiceCall
} from './chat-detail/shared/utils/errorHandler.js';
export { ValidationHelper } from './chat-detail/shared/utils/validationHelper.js';
export { ConfigHelper } from './chat-detail/shared/utils/configHelper.js';

// Message formatting and validation
export { 
  formatUserMessage,
  formatAssistantMessage,
  formatMessageForDisplay,
  formatMessagesForAI,
  validateMessageContent
} from './chat-detail/shared/utils/messageFormatters.js';

// Response builders
export { 
  generateMessageId,
  buildResponse,
  buildAIResponse,
  buildMockResponse,
  buildErrorResponse,
  buildFallbackResponse,
  buildTypingResponse,
  buildAssessmentResponse,
  combineResponses,
  buildSummaryResponse
} from './chat-detail/shared/utils/responseBuilders.js';

// Database operations
export { 
  insertChatMessage,
  insertChatMessageBatch,
  insertUserMessage,
  insertAssistantMessage
} from './chat-detail/shared/database/chatCreateMessage.js';
export { 
  updateChatMessage,
  deleteSubsequentMessages,
  updateMessageAndTriggerResponse,
  softDeleteMessage,
  updateMessageMetadata,
  markMessageAsEdited
} from './chat-detail/shared/database/chatUpdateMessage.js';
export { ChatDatabaseOperations } from './chat-detail/shared/database/chatOperations.js';

// ===================================
// SERVICES
// ===================================

// Service detection and configuration
export { 
  detectService,
  checkAIServiceAvailability,
  getServiceConfig,
  forceServiceMode,
  resetServiceMode,
  getServiceStatus,
  validateServiceConfig
} from './chat-detail/chatbot-message/services/serviceDetector.js';

// Base Generator
export { BaseGenerator } from './chat-detail/chatbot-message/services/generators/BaseGenerator.js';

// AI Services
export { generateInitialResponse as generateInitialAI } from './chat-detail/chatbot-message/services/ai/generators/initialAI.js';
export { 
  generateFollowUpResponse as generateFollowUpAI,
  generateContextualAIResponse
} from './chat-detail/chatbot-message/services/ai/generators/followUpAI.js';

// Mock Services
export { 
  generateInitialResponse as generateInitialMock,
  generateAssessmentInitialResponse
} from './chat-detail/chatbot-message/services/mock/generators/initialMock.js';
export { 
  generateFollowUpResponse as generateFollowUpMock,
  generateContextualResponse as generateContextualMock
} from './chat-detail/chatbot-message/services/mock/generators/followUpMock.js';

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
  const { createConversationWithMessage } = await import('./chat-detail/shared/create-conversation/createFlow.js');
  return await createConversationWithMessage(userId, message, assessmentId);
};

/**
 * Get conversation ready for display in frontend
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Frontend-ready conversation data
 */
export const getDisplayReady = async (conversationId, userId) => {
  const { getConversationForDisplay } = await import('./chat-detail/read-chat-detail/getWithContext.js');
  return await getConversationForDisplay(conversationId, userId);
};

/**
 * Send message and get response in one call
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID
 * @param {string} message - Message to send
 * @returns {Promise<Object>} - Message exchange result
 */
export const sendAndRespond = async (conversationId, userId, message) => {
  const { sendMessage } = await import('./chat-detail/user-message/add-message/sendMessage.js');
  return await sendMessage(conversationId, userId, message);
};

/**
 * Get service status and health check
 * @returns {Promise<Object>} - Service status information
 */
export const healthCheck = async () => {
  const { getServiceStatus } = await import('./chat-detail/chatbot-message/services/serviceDetector.js');
  return await getServiceStatus();
};

// ===================================
// BACKWARD COMPATIBILITY
// ===================================
// Re-export legacy function names for backward compatibility

export { getUserConversations as getConversations };
export { createConversation as newConversation };
export { getConversationHistory as readConversation };
export { sendMessage as sendMessageNew };

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

/**
 * @typedef {Object} ServiceStatus
 * @property {string} currentService - Current service type ('ai' or 'mock')
 * @property {boolean} aiServiceAvailable - AI service availability
 * @property {boolean} isForced - Whether service mode is forced
 * @property {string|null} forcedMode - Forced service mode if any
 * @property {Object} config - Service configuration
 * @property {string} timestamp - Status check timestamp
 */ 