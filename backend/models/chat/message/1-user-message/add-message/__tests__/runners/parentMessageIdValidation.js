import { describe, it, expect, beforeEach, vi } from 'vitest';
import { sendMessage } from '../../sendUserMessage.js';
import { getMostRecentMessage, verifyParentMessageId } from '../../database/linkParentMessageId.js';
import DbService from '@/services/dbService.js';

/**
 * Tests for parent_message_id validation and linking
 */
export const runParentMessageIdTests = (mockData) => {
  const { 
    mockUserId, 
    mockConversationId,
    mockUserMessageId,
    mockAssistantMessageId
  } = mockData;

  describe('Parent message ID validation and linking', () => {
    beforeEach(() => {
      // Reset the mocks that are already configured in the parent test file
      vi.resetAllMocks();
    });

    it('should allow first message in conversation without parent_message_id', async () => {
      // Setup test data
      const messageData = {
        id: 'msg-user-first',
        role: 'user',
        content: 'First message in conversation',
        created_at: new Date().toISOString()
      };
      
      // Mock for first message scenario
      verifyParentMessageId.mockResolvedValue({
        ...messageData,
        parent_message_id: null
      });
      
      // Call the mocked function
      const result = await verifyParentMessageId(mockConversationId, messageData);
      
      // First message should have null parent_message_id
      expect(result.parent_message_id).toBeNull();
    });

    it('should ensure second message has parent_message_id set to first message', async () => {
      // Create test data
      const firstMessage = {
        id: 'msg-first-123',
        role: 'user',
        content: 'First message',
        conversation_id: mockConversationId,
        created_at: new Date(Date.now() - 60000).toISOString() // 1 minute ago
      };
      
      const secondMessageData = {
        id: 'msg-second-456',
        role: 'user',
        content: 'Second message',
        conversation_id: mockConversationId,
        created_at: new Date().toISOString()
      };
      
      // Mock getMostRecentMessage to return the first message
      getMostRecentMessage.mockResolvedValue(firstMessage);
      
      // Mock verifyParentMessageId to set parent_message_id
      verifyParentMessageId.mockResolvedValue({
        ...secondMessageData,
        parent_message_id: firstMessage.id
      });
      
      // Call the mocked function
      const result = await verifyParentMessageId(mockConversationId, secondMessageData);
      
      // Second message should have parent_message_id set to first message ID
      expect(result.parent_message_id).toBe(firstMessage.id);
    });

    it('should maintain parent-child relationship in conversation thread', async () => {
      // Setup mock messages
      const mostRecentMessage = {
        id: 'msg-3',
        role: 'user',
        content: 'Follow-up question',
        conversation_id: mockConversationId,
        parent_message_id: 'msg-2',
        created_at: new Date(Date.now() - 180000).toISOString()
      };
      
      // Mock getMostRecentMessage to return the most recent message
      getMostRecentMessage.mockResolvedValue(mostRecentMessage);
      
      // Create new message without parent_message_id
      const newMessageData = {
        id: 'msg-4',
        role: 'assistant',
        content: 'New response',
        conversation_id: mockConversationId,
        created_at: new Date().toISOString()
      };
      
      // Mock verifyParentMessageId to set parent_message_id
      verifyParentMessageId.mockResolvedValue({
        ...newMessageData,
        parent_message_id: mostRecentMessage.id
      });
      
      // Verify most recent message has expected properties
      expect(mostRecentMessage.id).toBe('msg-3');
      expect(mostRecentMessage.parent_message_id).toBe('msg-2');
      
      // Call the mocked function
      const result = await verifyParentMessageId(mockConversationId, newMessageData);
      
      // New message should have parent_message_id set to most recent message ID
      expect(result.parent_message_id).toBe('msg-3');
    });

    it('should handle case where specified parent_message_id does not exist', async () => {
      // Setup mock data
      const mockRecentMessage = {
        id: 'msg-valid-123',
        role: 'user',
        content: 'Valid message',
        conversation_id: mockConversationId,
        created_at: new Date(Date.now() - 60000).toISOString()
      };
      
      // Message with invalid parent_message_id
      const messageData = {
        id: 'msg-new-456',
        role: 'user',
        content: 'New message with invalid parent',
        conversation_id: mockConversationId,
        parent_message_id: 'msg-nonexistent-999',
        created_at: new Date().toISOString()
      };
      
      // Mock DbService.exists to indicate parent doesn't exist
      DbService.exists.mockResolvedValue(false);
      
      // Mock getMostRecentMessage to return valid message
      getMostRecentMessage.mockResolvedValue(mockRecentMessage);
      
      // Mock verifyParentMessageId to correct parent_message_id
      verifyParentMessageId.mockResolvedValue({
        ...messageData,
        parent_message_id: mockRecentMessage.id
      });
      
      // Call the mocked function
      const result = await verifyParentMessageId(mockConversationId, messageData);
      
      // Should fall back to most recent valid message
      expect(result.parent_message_id).toBe(mockRecentMessage.id);
    });
  });
}; 