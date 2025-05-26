import { describe, beforeEach, afterEach, vi } from 'vitest';
import DbService from '@/services/dbService.ts';
import logger from '@/services/logger.ts';

// Import test runners
import { runMessageCreationTests } from './runners/messageCreation.ts';
import { runChatbotResponseTests } from './runners/chatbotResponse.ts';
import { runDialogueSequenceTests } from './runners/dialogueSequence.ts';
import { runDatabaseIntegrationTests } from './runners/databaseIntegration.ts';

// Import mock data
import { messageFlowTestData } from './mock-data/messageFlowTestData.ts';
import { v4 as uuidv4 } from 'uuid';

// Mock all dependencies
vi.mock('@/services/dbService.ts');
vi.mock('@/services/logger.ts');
vi.mock('../../../chatbot-message/database/sendChatbotMessage.ts', () => ({
  sendChatbotMessage: vi.fn(),
  getMessage: vi.fn(),
  getConversationMessages: vi.fn()
}));
vi.mock('../database/sendUserMessage.ts', () => ({
  insertUserMessage: vi.fn()
}));
vi.mock('../sendUserMessage.ts', () => ({
  sendMessage: vi.fn()
}));
vi.mock('../../../../chatbot-message/generateResponse.ts', () => ({
  generateResponseToMessage: vi.fn()
}));
vi.mock('../../../../chatbot-message/database/sendChatbotMessage.ts', () => ({
  sendChatbotMessage: vi.fn(),
  getMessage: vi.fn(),
  getConversationMessages: vi.fn()
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
    
    // Mock UUID generation for consistent testing
    uuidv4
      .mockReturnValueOnce(messageFlowTestData.mockUserMessageId)
      .mockReturnValueOnce(messageFlowTestData.mockAssistantMessageId);

    // Setup isolated database function mocks
    const { insertUserMessage } = await import('../database/sendUserMessage.ts');
    insertUserMessage.mockResolvedValue(messageFlowTestData.mockUserMessage);

    const { sendMessage } = await import('../sendUserMessage.ts');
    sendMessage.mockResolvedValue({
      userMessage: messageFlowTestData.mockUserMessage,
      assistantMessage: messageFlowTestData.mockAssistantMessage,
      conversationId: messageFlowTestData.mockConversationId,
      timestamp: new Date().toISOString()
    });

    const { generateResponseToMessage } = await import('../../../../chatbot-message/generateResponse.ts');
    // Force the mock to return our specific mock data
    generateResponseToMessage.mockImplementation(async (conversationId, userMessageId, messageText) => {
      return messageFlowTestData.mockAssistantMessage;
    });

    const { sendChatbotMessage } = await import('../../../../chatbot-message/database/sendChatbotMessage.ts');
    sendChatbotMessage.mockResolvedValue(messageFlowTestData.mockAssistantMessage);
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
  });
}); 
