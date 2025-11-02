import { describe, beforeEach, afterEach, vi, it, expect } from 'vitest';
import DbService from '@/services/dbService.js';
import logger from '@/services/logger.js';

// Import test runners
import { runConversationUpdateTests } from './runners/conversationUpdate.js';
import { runMessageCountTests } from './runners/messageCount.js';
import { runPreviewUpdateTests } from './runners/previewUpdate.js';
import { runTimestampUpdateTests } from './runners/timestampUpdate.js';
import { runMessageOrderingTests } from './runners/messageOrdering.js';

// Mock all dependencies
vi.mock('@/services/dbService.js');
vi.mock('@/services/logger.js');
vi.mock('../conversation/read-conversation/getConversation.js', () => ({
  getConversation: vi.fn(),
  getConversationSummary: vi.fn()
}));
vi.mock('../message/1-user-message/add-message/database/sendUserMessage.js', () => ({
  insertChatMessage: vi.fn()
}));
vi.mock('../message/2-chatbot-message/database/sendChatbotMessage.js', () => ({
  sendChatbotMessage: vi.fn()
}));

describe('Conversation Object Updates on Message Addition', () => {
  // Shared test data
  const mockData = {
    mockUserId: 'test-user-123',
    mockConversationId: 'test-conversation-789',
    mockAssessmentId: 'test-assessment-456',
    
    // Initial conversation state (no messages)
    mockInitialConversation: {
      id: 'test-conversation-789',
      user_id: 'test-user-123',
      assessment_id: 'test-assessment-456',
      assessment_pattern: 'irregular',
      title: 'Assessment Conversation',
      preview: null,
      created_at: '2024-01-15T10:00:00.000Z',
      updated_at: '2024-01-15T10:00:00.000Z',
      messageCount: 0
    },

    // Updated conversation state (after first message)
    mockUpdatedConversation: {
      id: 'test-conversation-789',
      user_id: 'test-user-123',
      assessment_id: 'test-assessment-456',
      assessment_pattern: 'irregular',
      title: 'Assessment Conversation',
      preview: 'Hi, could you look at my assessment results...',
      created_at: '2024-01-15T10:00:00.000Z',
      updated_at: '2024-01-15T10:05:00.000Z',
      messageCount: 1
    },

    // Further updated conversation state (after second message)
    mockFinalConversation: {
      id: 'test-conversation-789',
      user_id: 'test-user-123',
      assessment_id: 'test-assessment-456',
      assessment_pattern: 'irregular',
      title: 'Assessment Conversation',
      preview: 'Based on your assessment, I can see...',
      created_at: '2024-01-15T10:00:00.000Z',
      updated_at: '2024-01-15T10:06:00.000Z',
      messageCount: 2
    },

    // Test messages
    mockUserMessage: {
      id: 'msg-user-123',
      conversation_id: 'test-conversation-789',
      role: 'user',
      content: 'Hi, could you look at my assessment results and provide some guidance?',
      created_at: '2024-01-15T10:05:00.000Z'
    },

    mockAssistantMessage: {
      id: 'msg-assistant-456',
      conversation_id: 'test-conversation-789',
      role: 'assistant',
      content: 'Based on your assessment, I can see that you have an irregular cycle pattern. Let me provide some personalized recommendations.',
      created_at: '2024-01-15T10:06:00.000Z'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    logger.info = vi.fn();
    logger.error = vi.fn();
    
    // Mock DbService operations
    DbService.findByIdWithJson = vi.fn();
    DbService.findByFieldWithJson = vi.fn();
    DbService.update = vi.fn();
    DbService.create = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Run all test suites in sequence
  describe('Sequential Test Execution', () => {
    runConversationUpdateTests(mockData);
    runMessageCountTests(mockData);
    runPreviewUpdateTests(mockData);
    runTimestampUpdateTests(mockData);
    runMessageOrderingTests(mockData);
  });
}); 