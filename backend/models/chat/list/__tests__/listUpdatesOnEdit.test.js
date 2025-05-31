import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getUserConversations } from '../chatGetList.js';
import { editMessageWithRegeneration } from '../../message/user-message/add-message/edit-message.js/editMessageRegeneration.js';
import DbService from '@/services/dbService.js';
import logger from '@/services/logger.js';

// Mock dependencies
vi.mock('@/services/dbService.js');
vi.mock('@/services/logger.js');
vi.mock('../../message/user-message/add-message/edit-message.js/editMessageRegeneration.js', () => ({
  editMessageWithRegeneration: vi.fn()
}));

describe('List Updates on Message Edit', () => {
  const mockUserId = 'test-user-123';
  const mockConversationId = 'test-conversation-456';
  const mockMessageId = 'test-message-789';
  
  beforeEach(() => {
    vi.clearAllMocks();
    logger.error = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Preview Updates After Edit', () => {
    it('should update preview when the most recent message is edited', async () => {
      const originalPreview = 'Original message content that was the latest';
      const updatedPreview = 'Updated message content that is now the latest';
      
      // State before edit
      const beforeEdit = [{
        id: mockConversationId,
        user_id: mockUserId,
        assessment_id: 'assessment-123',
        assessment_pattern: 'irregular',
        message_count: 3,
        preview: originalPreview,
        last_message_date: '2024-01-15T10:00:00.000Z'
      }];

      // State after edit
      const afterEdit = [{
        id: mockConversationId,
        user_id: mockUserId,
        assessment_id: 'assessment-123',
        assessment_pattern: 'irregular',
        message_count: 3, // Same count since we edited, not added
        preview: updatedPreview,
        last_message_date: '2024-01-15T10:01:00.000Z' // Updated timestamp
      }];

      DbService.getConversationsWithPreviews
        .mockResolvedValueOnce(beforeEdit)
        .mockResolvedValueOnce(afterEdit);

      // Get list before edit
      const before = await getUserConversations(mockUserId);
      expect(before[0].preview).toBe(originalPreview);

      // Simulate message edit
      editMessageWithRegeneration.mockResolvedValue({
        updatedMessage: {
          id: mockMessageId,
          content: updatedPreview,
          edited_at: '2024-01-15T10:01:00.000Z'
        },
        newResponse: null,
        deletedMessageIds: [],
        conversationId: mockConversationId
      });

      // Get list after edit
      const after = await getUserConversations(mockUserId);
      expect(after[0].preview).toBe(updatedPreview);
      expect(after[0].message_count).toBe(3); // Should remain the same
    });

    it('should update preview when edited message becomes new most recent after regeneration', async () => {
      const beforeEdit = [{
        id: mockConversationId,
        user_id: mockUserId,
        assessment_id: 'assessment-456',
        assessment_pattern: 'heavy',
        message_count: 4,
        preview: 'Previous assistant response was the latest',
        last_message_date: '2024-01-15T09:30:00.000Z'
      }];

      const afterEdit = [{
        id: mockConversationId,
        user_id: mockUserId,
        assessment_id: 'assessment-456',
        assessment_pattern: 'heavy',
        message_count: 3, // Reduced because old responses were deleted
        preview: 'New assistant response after message edit',
        last_message_date: '2024-01-15T10:05:00.000Z'
      }];

      DbService.getConversationsWithPreviews
        .mockResolvedValueOnce(beforeEdit)
        .mockResolvedValueOnce(afterEdit);

      const before = await getUserConversations(mockUserId);
      expect(before[0].message_count).toBe(4);
      expect(before[0].preview).toBe('Previous assistant response was the latest');

      const after = await getUserConversations(mockUserId);
      expect(after[0].message_count).toBe(3);
      expect(after[0].preview).toBe('New assistant response after message edit');
    });

    it('should handle preview truncation after edit for long messages', async () => {
      const longEditedMessage = 'This is a very long edited message that exceeds the fifty character limit and should be truncated with ellipsis';
      
      const afterEdit = [{
        id: mockConversationId,
        user_id: mockUserId,
        assessment_id: 'assessment-789',
        assessment_pattern: 'pain',
        message_count: 2,
        preview: longEditedMessage,
        last_message_date: '2024-01-15T10:02:00.000Z'
      }];

      DbService.getConversationsWithPreviews.mockResolvedValue(afterEdit);

      const result = await getUserConversations(mockUserId);
      expect(result[0].preview).toBe(longEditedMessage + '...');
      expect(result[0].preview.length).toBeGreaterThan(50);
    });
  });

  describe('Message Count Updates After Edit', () => {
    it('should maintain message count when editing without regeneration', async () => {
      const conversation = {
        id: mockConversationId,
        user_id: mockUserId,
        assessment_id: 'assessment-regular',
        assessment_pattern: 'regular',
        message_count: 5,
        preview: 'Edited message content',
        last_message_date: '2024-01-15T10:03:00.000Z'
      };

      DbService.getConversationsWithPreviews.mockResolvedValue([conversation]);

      const result = await getUserConversations(mockUserId);
      expect(result[0].message_count).toBe(5);
    });

    it('should decrease message count when edit triggers cleanup of subsequent messages', async () => {
      const beforeEdit = [{
        id: mockConversationId,
        message_count: 8,
        preview: 'Original message in middle of conversation',
        last_message_date: '2024-01-15T09:00:00.000Z'
      }];

      const afterEdit = [{
        id: mockConversationId, 
        message_count: 4, // Reduced because messages after edited one were deleted
        preview: 'New response after edit and cleanup',
        last_message_date: '2024-01-15T10:00:00.000Z'
      }];

      DbService.getConversationsWithPreviews
        .mockResolvedValueOnce(beforeEdit)
        .mockResolvedValueOnce(afterEdit);

      const before = await getUserConversations(mockUserId);
      expect(before[0].message_count).toBe(8);

      const after = await getUserConversations(mockUserId);
      expect(after[0].message_count).toBe(4);
    });
  });

  describe('Timestamp Updates After Edit', () => {
    it('should update last_message_date when message is edited', async () => {
      const originalTimestamp = '2024-01-15T09:00:00.000Z';
      const updatedTimestamp = '2024-01-15T10:15:00.000Z';

      const beforeEdit = [{
        id: mockConversationId,
        last_message_date: originalTimestamp,
        preview: 'Original content',
        message_count: 2
      }];

      const afterEdit = [{
        id: mockConversationId,
        last_message_date: updatedTimestamp,
        preview: 'Edited content',
        message_count: 2
      }];

      DbService.getConversationsWithPreviews
        .mockResolvedValueOnce(beforeEdit)
        .mockResolvedValueOnce(afterEdit);

      const before = await getUserConversations(mockUserId);
      expect(before[0].last_message_date).toBe(originalTimestamp);

      const after = await getUserConversations(mockUserId);
      expect(after[0].last_message_date).toBe(updatedTimestamp);
    });

    it('should reflect newest timestamp when regeneration creates new response', async () => {
      const editTimestamp = '2024-01-15T10:15:00.000Z';
      const responseTimestamp = '2024-01-15T10:16:00.000Z';

      const afterEditAndRegeneration = [{
        id: mockConversationId,
        last_message_date: responseTimestamp, // Should reflect the newest message (response)
        preview: 'New assistant response after edit',
        message_count: 4
      }];

      DbService.getConversationsWithPreviews.mockResolvedValue(afterEditAndRegeneration);

      const result = await getUserConversations(mockUserId);
      expect(result[0].last_message_date).toBe(responseTimestamp);
    });
  });

  describe('Assessment Data Preservation During Edit', () => {
    it('should preserve assessment_id and pattern during message edits', async () => {
      const conversation = {
        id: mockConversationId,
        user_id: mockUserId,
        assessment_id: 'assessment-preserve-123',
        assessment_pattern: 'developing',
        message_count: 6,
        preview: 'Message was edited but assessment data preserved',
        last_message_date: '2024-01-15T10:20:00.000Z'
      };

      DbService.getConversationsWithPreviews.mockResolvedValue([conversation]);

      const result = await getUserConversations(mockUserId);
      expect(result[0].assessment_id).toBe('assessment-preserve-123');
      expect(result[0].assessment_pattern).toBe('developing');
      expect(result[0].user_id).toBe(mockUserId);
    });
  });

  describe('Multiple Conversations Edit Impact', () => {
    it('should only update the conversation containing the edited message', async () => {
      const conversations = [
        {
          id: 'conv-1',
          user_id: mockUserId,
          assessment_id: 'assessment-1',
          assessment_pattern: 'regular',
          message_count: 3,
          preview: 'Unaffected conversation 1',
          last_message_date: '2024-01-14T10:00:00.000Z'
        },
        {
          id: mockConversationId, // This one gets edited
          user_id: mockUserId,
          assessment_id: 'assessment-2',
          assessment_pattern: 'irregular',
          message_count: 5,
          preview: 'Updated message in this conversation',
          last_message_date: '2024-01-15T10:25:00.000Z'
        },
        {
          id: 'conv-3',
          user_id: mockUserId,
          assessment_id: 'assessment-3',
          assessment_pattern: 'heavy',
          message_count: 2,
          preview: 'Unaffected conversation 3',
          last_message_date: '2024-01-13T10:00:00.000Z'
        }
      ];

      DbService.getConversationsWithPreviews.mockResolvedValue(conversations);

      const result = await getUserConversations(mockUserId);
      
      expect(result).toHaveLength(3);
      expect(result[0].preview).toBe('Unaffected conversation 1');
      expect(result[1].preview).toBe('Updated message in this conversation');
      expect(result[2].preview).toBe('Unaffected conversation 3');
      
      // Only the edited conversation should have updated timestamp
      expect(result[1].last_message_date).toBe('2024-01-15T10:25:00.000Z');
    });
  });
}); 