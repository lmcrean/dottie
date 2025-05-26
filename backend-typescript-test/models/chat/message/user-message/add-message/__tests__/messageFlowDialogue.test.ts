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
vi.mock('uuid', () => ({
  v4: vi.fn()
}));

describe('Message Flow Dialogue Integration Tests', () => {

  beforeEach(() => {
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
