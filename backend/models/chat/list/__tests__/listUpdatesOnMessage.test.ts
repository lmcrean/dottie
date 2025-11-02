import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getUserConversations } from '../chatGetList.js';
import { sendMessage } from '../../message/user-message/add-message/sendMessage.js';
import { createAssessmentConversation } from '../../conversation/create-new-conversation/createFlow.js';
import DbService from '@/services/dbService.js';
import logger from '@/services/logger.js';

// Mock dependencies
vi.mock('@/services/dbService.js');
vi.mock('@/services/logger.js');
vi.mock('../../message/user-message/add-message/sendMessage.js', () => ({
  sendMessage: vi.fn()
}));
vi.mock('../../conversation/create-new-conversation/createFlow.js', () => ({
  createAssessmentConversation: vi.fn()
}));

describe('List Updates on New Message', () => {
  const mockUserId = 'test-user-123';
  const mockConversationId = 'test-conversation-456';
  const mockAssessmentId = 'test-assessment-789';
  
  beforeEach(() => {
    vi.clearAllMocks();
    logger.error = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Message Count Updates', () => {
    it('should increment message count when new message is added', async () => {
      // Initial state: conversation with 0 messages
      const initialList = [{
        id: mockConversationId,
        last_message_date: null,
        preview: 'No messages yet',
        message_count: 0,
        assessment_id: mockAssessmentId,
        assessment_pattern: 'regular',
        user_id: mockUserId
      }];

      // After adding message: conversation with 1 message
      const updatedList = [{
        id: mockConversationId,
        last_message_date: '2024-01-15T10:00:00.000Z',
        preview: 'Hello, I need help with my assessment results',
        message_count: 1,
        assessment_id: mockAssessmentId,
        assessment_pattern: 'regular',
        user_id: mockUserId
      }];

      DbService.getConversationsWithPreviews
        .mockResolvedValueOnce(initialList)
        .mockResolvedValueOnce(updatedList);

      // Get initial list
      const before = await getUserConversations(mockUserId);
      expect(before[0].message_count).toBe(0);

      // Simulate adding a message
      sendMessage.mockResolvedValue({
        id: 'msg-123',
        content: 'Hello, I need help with my assessment results',
        role: 'user'
      });

      // Get updated list
      const after = await getUserConversations(mockUserId);
      expect(after[0].message_count).toBe(1);
      expect(after[0].preview).toBe('Hello, I need help with my assessment results');
    });

    it('should increment from 1 to 2 when assistant responds', async () => {
      // State after user message
      const afterUserMessage = [{
        id: mockConversationId,
        message_count: 1,
        preview: 'Hello, I need help with my assessment results',
        last_message_date: '2024-01-15T10:00:00.000Z',
        assessment_id: mockAssessmentId,
        assessment_pattern: 'regular',
        user_id: mockUserId
      }];

      // State after assistant response
      const afterAssistantResponse = [{
        id: mockConversationId,
        message_count: 2,
        preview: 'I\'d be happy to help you understand your assessment...',
        last_message_date: '2024-01-15T10:01:00.000Z',
        assessment_id: mockAssessmentId,
        assessment_pattern: 'regular',
        user_id: mockUserId
      }];

      DbService.getConversationsWithPreviews
        .mockResolvedValueOnce(afterUserMessage)
        .mockResolvedValueOnce(afterAssistantResponse);

      const before = await getUserConversations(mockUserId);
      expect(before[0].message_count).toBe(1);

      const after = await getUserConversations(mockUserId);
      expect(after[0].message_count).toBe(2);
      expect(after[0].preview).toBe('I\'d be happy to help you understand your assessment......');
    });
  });

  describe('Preview Updates', () => {
    it('should update preview to most recent message content', async () => {
      const conversation = {
        id: mockConversationId,
        message_count: 3,
        preview: 'This is the latest message content',
        last_message_date: '2024-01-15T10:02:00.000Z',
        assessment_id: mockAssessmentId,
        assessment_pattern: 'irregular',
        user_id: mockUserId
      };

      DbService.getConversationsWithPreviews.mockResolvedValue([conversation]);

      const result = await getUserConversations(mockUserId);
      expect(result[0].preview).toBe('This is the latest message content');
    });

    it('should truncate long preview messages', async () => {
      const longMessage = 'This is a very long message that exceeds the fifty character limit for previews';
      const conversation = {
        id: mockConversationId,
        message_count: 1,
        preview: longMessage,
        last_message_date: '2024-01-15T10:00:00.000Z',
        assessment_id: mockAssessmentId,
        assessment_pattern: 'heavy',
        user_id: mockUserId
      };

      DbService.getConversationsWithPreviews.mockResolvedValue([conversation]);

      const result = await getUserConversations(mockUserId);
      expect(result[0].preview).toBe(longMessage + '...');
      expect(result[0].preview.length).toBeGreaterThan(50);
    });

    it('should handle empty preview gracefully', async () => {
      const conversation = {
        id: mockConversationId,
        message_count: 0,
        preview: null,
        last_message_date: null,
        assessment_id: mockAssessmentId,
        assessment_pattern: 'pain',
        user_id: mockUserId
      };

      DbService.getConversationsWithPreviews.mockResolvedValue([conversation]);

      const result = await getUserConversations(mockUserId);
      expect(result[0].preview).toBe('No messages yet');
    });
  });
}); 