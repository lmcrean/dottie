import { describe, beforeEach, afterEach, vi } from 'vitest';
import DbService from '@/services/dbService.js';
import logger from '@/services/logger.js';

// Import test runners
import { runMessageCreationTests } from './runners/messageCreation.js';
import { runChatbotResponseTests } from './runners/chatbotResponse.js';
import { runDialogueSequenceTests } from './runners/dialogueSequence.js';
import { runDatabaseIntegrationTests } from './runners/databaseIntegration.js';
import { runParentMessageIdTests } from './runners/parentMessageIdValidation.js';

// Import mock data
import { messageFlowTestData } from './mock-data/messageFlowTestData.js';
import { v4 as uuidv4 } from 'uuid';

// Mock all dependencies
vi.mock('@/services/dbService.js');
vi.mock('@/services/logger.js');
vi.mock('../../../chatbot-message/database/sendChatbotMessage.js', () => ({
  sendChatbotMessage: vi.fn(),
  getMessage: vi.fn(),
  getConversationMessages: vi.fn()
}));
vi.mock('../database/sendUserMessage.js', () => ({
  insertUserMessage: vi.fn()
}));
vi.mock('../sendUserMessage.js', () => ({
  sendMessage: vi.fn()
}));
vi.mock('../../../../chatbot-message/generateResponse.js', () => ({
  generateResponseToMessage: vi.fn()
}));
vi.mock('../../../../chatbot-message/database/sendChatbotMessage.js', () => ({
  sendChatbotMessage: vi.fn(),
  getMessage: vi.fn(),
  getConversationMessages: vi.fn()
}));
vi.mock('../database/linkParentMessageId.js', () => ({
  getMostRecentMessage: vi.fn(),
  verifyParentMessageId: vi.fn(),
  updateMessageWithParentId: vi.fn()
}));
vi.mock('uuid', () => ({
  v4: vi.fn()
}));

describe('Message Flow Dialogue Integration Tests', () => {

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Setup default mocks
    logger.info = vi.fn();
    logger.error = vi.fn();
    
    // Mock DbService operations
    DbService.create = vi.fn();
    DbService.findById = vi.fn();
    DbService.findWhere = vi.fn();
    DbService.exists = vi.fn().mockResolvedValue(true);
    
    // Mock UUID generation for consistent testing
    uuidv4
      .mockReturnValueOnce(messageFlowTestData.mockUserMessageId)
      .mockReturnValueOnce(messageFlowTestData.mockAssistantMessageId);

    // Setup isolated database function mocks
    const { insertUserMessage } = await import('../database/sendUserMessage.js');
    insertUserMessage.mockResolvedValue(messageFlowTestData.mockUserMessage);

    const { sendMessage } = await import('../sendUserMessage.js');
    sendMessage.mockResolvedValue({
      userMessage: messageFlowTestData.mockUserMessage,
      assistantMessage: messageFlowTestData.mockAssistantMessage,
      conversationId: messageFlowTestData.mockConversationId,
      timestamp: new Date().toISOString()
    });

    const { generateResponseToMessage } = await import('../../../../chatbot-message/generateResponse.js');
    // Force the mock to return our specific mock data
    generateResponseToMessage.mockImplementation(async (conversationId, userMessageId, messageText) => {
      return messageFlowTestData.mockAssistantMessage;
    });

    const { sendChatbotMessage } = await import('../../../../chatbot-message/database/sendChatbotMessage.js');
    sendChatbotMessage.mockResolvedValue(messageFlowTestData.mockAssistantMessage);
    
    // Setup linkParentMessageId mocks
    const { getMostRecentMessage, verifyParentMessageId, updateMessageWithParentId } = await import('../database/linkParentMessageId.js');
    getMostRecentMessage.mockResolvedValue(messageFlowTestData.mockUserMessage);
    verifyParentMessageId.mockImplementation(async (conversationId, messageData) => {
      // For the first message in test data, return null parent_message_id
      if (messageData.id === 'msg-user-first') {
        return { ...messageData, parent_message_id: null };
      }
      // For other messages, ensure parent_message_id is set
      return { 
        ...messageData, 
        parent_message_id: messageData.parent_message_id || messageFlowTestData.mockUserMessageId 
      };
    });
    updateMessageWithParentId.mockImplementation(async (conversationId, messageId) => {
      return { 
        id: messageId,
        parent_message_id: messageFlowTestData.mockUserMessageId,
        conversation_id: conversationId
      };
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Run all test suites in sequence
  describe('Sequential Test Execution', () => {
    runMessageCreationTests(messageFlowTestData);
    runChatbotResponseTests(messageFlowTestData);
    runDialogueSequenceTests(messageFlowTestData);
    runDatabaseIntegrationTests(messageFlowTestData);
    runParentMessageIdTests(messageFlowTestData);
  });
}); 