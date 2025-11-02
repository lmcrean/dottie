import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import DbService from '@/services/dbService.js';
import logger from '@/services/logger.js';
import { getConversation, getConversationForUser, getConversationSummary } from '../getConversation.js';

// Mock all dependencies
vi.mock('@/services/dbService.js');
vi.mock('@/services/logger.js');

describe('getConversation - Read Conversation by ID', () => {
  // Shared test data
  const mockData = {
    conversationId: 'conv-123',
    userId: 'user-456',
    assessmentId: 'assessment-789',
    
    mockConversation: {
      id: 'conv-123',
      user_id: 'user-456',
      assessment_id: 'assessment-789',
      assessment_pattern: 'irregular',
      title: 'Assessment Conversation',
      created_at: '2024-01-15T10:00:00.000Z',
      updated_at: '2024-01-15T10:30:00.000Z'
    },

    mockMessages: [
      {
        id: 'msg-1',
        conversation_id: 'conv-123',
        content: 'Hi, could you look at my assessment results?',
        role: 'user',
        created_at: '2024-01-15T10:05:00.000Z'
      },
      {
        id: 'msg-2',
        conversation_id: 'conv-123',
        content: 'I\'d be happy to help you with your assessment results.',
        role: 'assistant',
        created_at: '2024-01-15T10:06:00.000Z'
      }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    logger.error = vi.fn();
    
    // Setup default successful database responses
    DbService.findByIdWithJson = vi.fn().mockResolvedValue(mockData.mockConversation);
    DbService.findByFieldWithJson = vi.fn().mockResolvedValue(mockData.mockMessages);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getConversation - Basic functionality', () => {
    it('should successfully retrieve a conversation by ID', async () => {
      const result = await getConversation(mockData.conversationId);
      
      expect(result.success).toBe(true);
      expect(result.conversation).toBeDefined();
      expect(result.conversation.id).toBe(mockData.conversationId);
      expect(result.conversation.user_id).toBe(mockData.userId);
      expect(result.conversation.assessment_id).toBe(mockData.assessmentId);
      expect(result.conversation.assessment_pattern).toBe('irregular');
    });

    it('should retrieve conversation with messages by default', async () => {
      const result = await getConversation(mockData.conversationId);
      
      expect(result.success).toBe(true);
      expect(result.messages).toBeDefined();
      expect(result.messages).toHaveLength(2);
      expect(result.messages[0].id).toBe('msg-1');
      expect(result.messages[0].content).toBe('Hi, could you look at my assessment results?');
      expect(result.messages[0].role).toBe('user');
    });

    it('should include correct message count in conversation object', async () => {
      const result = await getConversation(mockData.conversationId);
      
      expect(result.success).toBe(true);
      expect(result.conversation.messageCount).toBe(2);
    });

    it('should include pagination information', async () => {
      const result = await getConversation(mockData.conversationId);
      
      expect(result.success).toBe(true);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.offset).toBe(0);
      expect(result.pagination.limit).toBeNull();
      expect(result.pagination.hasMore).toBe(false);
    });

    it('should call database service with correct parameters', async () => {
      await getConversation(mockData.conversationId);
      
      expect(DbService.findByIdWithJson).toHaveBeenCalledWith(
        'conversations',
        mockData.conversationId,
        ['assessment_object']
      );
      
      expect(DbService.findByFieldWithJson).toHaveBeenCalledWith(
        'chat_messages',
        'conversation_id',
        mockData.conversationId,
        [],
        [
          { field: 'created_at', direction: 'ASC' },
          { field: 'id', direction: 'ASC' }
        ]
      );
    });
  });

  describe('getConversation - Options and pagination', () => {
    it('should support excluding messages when includeMessages is false', async () => {
      const result = await getConversation(mockData.conversationId, { includeMessages: false });
      
      expect(result.success).toBe(true);
      expect(result.messages).toHaveLength(0);
      expect(result.conversation.messageCount).toBe(0);
      expect(DbService.findByFieldWithJson).not.toHaveBeenCalled();
    });

    it('should support message pagination with limit', async () => {
      const result = await getConversation(mockData.conversationId, { limit: 1 });
      
      expect(result.success).toBe(true);
      expect(result.messages).toHaveLength(1);
      expect(result.messages[0].id).toBe('msg-1');
      expect(result.pagination.limit).toBe(1);
      expect(result.pagination.hasMore).toBe(true);
    });

    it('should support message pagination with offset', async () => {
      const result = await getConversation(mockData.conversationId, { offset: 1 });
      
      expect(result.success).toBe(true);
      expect(result.messages).toHaveLength(1);
      expect(result.messages[0].id).toBe('msg-2');
      expect(result.pagination.offset).toBe(1);
    });

    it('should support both limit and offset pagination', async () => {
      const result = await getConversation(mockData.conversationId, { limit: 1, offset: 1 });
      
      expect(result.success).toBe(true);
      expect(result.messages).toHaveLength(1);
      expect(result.messages[0].id).toBe('msg-2');
      expect(result.pagination.offset).toBe(1);
      expect(result.pagination.limit).toBe(1);
      expect(result.pagination.hasMore).toBe(false);
    });
  });

  describe('getConversation - Error handling', () => {
    it('should handle conversation not found', async () => {
      DbService.findByIdWithJson.mockResolvedValue(null);
      
      const result = await getConversation('non-existent-id');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Conversation not found');
      expect(result.conversationId).toBe('non-existent-id');
    });

    it('should handle database errors gracefully', async () => {
      const dbError = new Error('Database connection failed');
      DbService.findByIdWithJson.mockRejectedValue(dbError);
      
      const result = await getConversation(mockData.conversationId);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database connection failed');
      expect(result.conversationId).toBe(mockData.conversationId);
      expect(logger.error).toHaveBeenCalledWith('Error in getConversation:', dbError);
    });

    it('should handle message retrieval errors', async () => {
      const msgError = new Error('Failed to fetch messages');
      DbService.findByFieldWithJson.mockRejectedValue(msgError);
      
      const result = await getConversation(mockData.conversationId);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to fetch messages');
      expect(logger.error).toHaveBeenCalledWith('Error in getConversation:', msgError);
    });
  });

  describe('getConversationForUser - User authorization', () => {
    it('should successfully retrieve conversation for correct user', async () => {
      const result = await getConversationForUser(mockData.conversationId, mockData.userId);
      
      expect(result.success).toBe(true);
      expect(result.conversation.id).toBe(mockData.conversationId);
      expect(result.conversation.user_id).toBe(mockData.userId);
    });

    it('should deny access for wrong user', async () => {
      const result = await getConversationForUser(mockData.conversationId, 'wrong-user-id');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Conversation not found or access denied');
      expect(result.conversationId).toBe(mockData.conversationId);
    });

    it('should handle non-existent conversation', async () => {
      DbService.findByIdWithJson.mockResolvedValue(null);
      
      const result = await getConversationForUser('non-existent-id', mockData.userId);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Conversation not found');
    });
  });

  describe('getConversationSummary - Summary functionality', () => {
    it('should retrieve conversation summary with message count', async () => {
      const result = await getConversationSummary(mockData.conversationId);
      
      expect(result.success).toBe(true);
      expect(result.summary).toBeDefined();
      expect(result.summary.id).toBe(mockData.conversationId);
      expect(result.summary.messageCount).toBe(2);
      expect(result.summary.hasMessages).toBe(true);
      expect(result.summary.user_id).toBe(mockData.userId);
      expect(result.summary.assessment_id).toBe(mockData.assessmentId);
    });

    it('should handle conversation with no messages', async () => {
      DbService.findByFieldWithJson.mockResolvedValue([]);
      
      const result = await getConversationSummary(mockData.conversationId);
      
      expect(result.success).toBe(true);
      expect(result.summary.messageCount).toBe(0);
      expect(result.summary.hasMessages).toBe(false);
    });

    it('should handle summary for non-existent conversation', async () => {
      DbService.findByIdWithJson.mockResolvedValue(null);
      
      const result = await getConversationSummary('non-existent-id');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Conversation not found');
    });
  });
}); 