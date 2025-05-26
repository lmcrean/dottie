import { describe, beforeEach, afterEach, vi } from 'vitest';
import DbService from '@/services/dbService.js';
import logger from '@/services/logger.js';

// Import test runners
import { runMessageCreationTests } from './runners/messageCreation.js';
import { runChatbotResponseTests } from './runners/chatbotResponse.js';
import { runDialogueSequenceTests } from './runners/dialogueSequence.js';
import { runDatabaseIntegrationTests } from './runners/databaseIntegration.js';

// Mock all dependencies
vi.mock('@/services/dbService.js');
vi.mock('@/services/logger.js');
vi.mock('../../shared/database/chatOperations.js', () => ({
  ChatDatabaseOperations: {
    insertMessage: vi.fn(),
    getMessage: vi.fn(),
    getConversationMessages: vi.fn()
  }
}));
vi.mock('../sendMessage.js', () => ({
  sendMessage: vi.fn()
}));
vi.mock('../../chatbot-message/generateResponse.js', () => ({
  generateResponseToMessage: vi.fn()
}));

describe('Message Flow Dialogue Integration Tests', () => {
  // Shared test data
  const mockData = {
    mockUserId: 'test-user-123',
    mockConversationId: 'test-conversation-789',
    mockUserMessageId: 'msg-user-456',
    mockAssistantMessageId: 'msg-assistant-789',
    
    mockUserMessage: {
      id: 'msg-user-456',
      conversation_id: 'test-conversation-789',
      role: 'user',
      content: 'How can I manage my irregular periods better?',
      user_id: 'test-user-123',
      created_at: '2024-01-15T10:00:00.000Z'
    },

    mockAssistantMessage: {
      id: 'msg-assistant-789',
      conversation_id: 'test-conversation-789',
      role: 'assistant',
      content: 'Based on your irregular period pattern, I recommend tracking your cycle...',
      created_at: '2024-01-15T10:01:00.000Z',
      parent_message_id: 'msg-user-456'
    },

    mockConversation: {
      id: 'test-conversation-789',
      user_id: 'test-user-123',
      messages: [
        {
          id: 'msg-user-456',
          role: 'user',
          content: 'How can I manage my irregular periods better?',
          created_at: '2024-01-15T10:00:00.000Z'
        },
        {
          id: 'msg-assistant-789',
          role: 'assistant', 
          content: 'Based on your irregular period pattern, I recommend tracking your cycle...',
          created_at: '2024-01-15T10:01:00.000Z'
        }
      ],
      created_at: '2024-01-15T09:30:00.000Z'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    logger.info = vi.fn();
    logger.error = vi.fn();
    
    // Mock DbService operations
    DbService.create = vi.fn();
    DbService.findById = vi.fn();
    
    // Mock UUID generation for consistent testing
    vi.mock('uuid', () => ({
      v4: vi.fn()
        .mockReturnValueOnce(mockData.mockUserMessageId)
        .mockReturnValueOnce(mockData.mockAssistantMessageId)
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Run all test suites in sequence
  describe('Sequential Test Execution', () => {
    runMessageCreationTests(mockData);
    runChatbotResponseTests(mockData);
    runDialogueSequenceTests(mockData);
    runDatabaseIntegrationTests(mockData);
  });
}); 