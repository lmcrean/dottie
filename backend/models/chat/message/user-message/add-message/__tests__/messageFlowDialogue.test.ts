import { TestRequestBody, TestOptions, MockResponse, TestUserOverrides, TestCycleOverrides, TestSymptomOverrides, TestAssessmentOverrides } from '../types/common';
import { describe, beforeEach, afterEach, vi } from 'vitest';
import { v4 as uuidv4 } from 'uuid';

// Import test runners
import { runMessageCreationTests } from './runners/messageCreation.js';
import { runChatbotResponseTests } from './runners/chatbotResponse.js';
import { runDialogueSequenceTests } from './runners/dialogueSequence.js';
import { runDatabaseIntegrationTests } from './runners/databaseIntegration.js';

// Import mock data
import { messageFlowTestData } from './mock-data/messageFlowTestData.js';

// Mock dependencies without importing them directly
vi.mock('@/services/dbService.ts', () => ({
  default: {
    create: vi.fn(),
    findById: vi.fn()
  }
}));

vi.mock('@/services/logger.ts', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn()
  }
}));

// Mock message functions
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
  sendChatbotMessage: vi.fn()
}));

vi.mock('uuid', () => ({
  v4: vi.fn()
}));

describe('Message Flow Dialogue Integration Tests', () => {

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Mock UUID generation for consistent testing
    (uuidv4 as any)
      .mockReturnValueOnce(messageFlowTestData.mockUserMessageId)
      .mockReturnValueOnce(messageFlowTestData.mockAssistantMessageId);

    // Setup isolated database function mocks
    const { insertUserMessage } = await import('../database/sendUserMessage.ts');
    (insertUserMessage as any).mockResolvedValue(messageFlowTestData.mockUserMessage);

    const { sendMessage } = await import('../sendUserMessage.ts');
    (sendMessage as any).mockResolvedValue({
      userMessage: messageFlowTestData.mockUserMessage,
      assistantMessage: messageFlowTestData.mockAssistantMessage,
      conversationId: messageFlowTestData.mockConversationId,
      timestamp: new Date().toISOString()
    });

    const { generateResponseToMessage } = await import('../../../../chatbot-message/generateResponse.ts');
    (generateResponseToMessage as any).mockImplementation(async (conversationId: string, userMessageId: string, messageText: string) => {
      return messageFlowTestData.mockAssistantMessage;
    });

    const { sendChatbotMessage } = await import('../../../../chatbot-message/database/sendChatbotMessage.ts');
    (sendChatbotMessage as any).mockResolvedValue(messageFlowTestData.mockAssistantMessage);
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

