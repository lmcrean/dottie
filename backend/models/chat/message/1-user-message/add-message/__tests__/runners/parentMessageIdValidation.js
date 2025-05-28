import { describe, it, expect, beforeEach } from 'vitest';
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
      // Functions are already mocked in the main test file
      // Reset specific mocks for these tests if needed
    });

    it('should allow first message in conversation without parent_message_id', async () => {
      // Mock DbService.findWhere to return empty array (no existing messages)
      DbService.findWhere = vi.fn().mockResolvedValue([]);
      
      // Create test message data
      const messageData = {
        id: 'msg-first-123',
        role: 'user',
        content: 'First message in conversation',
        created_at: new Date().toISOString()
      };
      
      // Call verifyParentMessageId function
      const result = await verifyParentMessageId(mockConversationId, messageData);
      
      // First message should have null parent_message_id
      expect(result.parent_message_id).toBeNull();
    });

    it('should ensure second message has parent_message_id set to first message', async () => {
      // Create a sequence of messages in the same conversation
      const firstMessage = {
        id: 'msg-first-123',
        role: 'user',
        content: 'First message',
        conversation_id: mockConversationId,
        created_at: new Date(Date.now() - 60000).toISOString() // 1 minute ago
      };
      
      // Mock getMostRecentMessage to return the first message
      vi.mock('../../database/linkParentMessageId.js', () => ({
        getMostRecentMessage: vi.fn().mockResolvedValue(firstMessage),
        verifyParentMessageId: vi.requireActual('../../database/linkParentMessageId.js').verifyParentMessageId
      }));
      
      // Second message without parent_message_id
      const secondMessageData = {
        id: 'msg-second-456',
        role: 'user',
        content: 'Second message',
        conversation_id: mockConversationId,
        created_at: new Date().toISOString()
      };
      
      // Import the real functions (after mocking)
      const { verifyParentMessageId } = await import('../../database/linkParentMessageId.js');
      
      // Verify parent_message_id gets set correctly
      const result = await verifyParentMessageId(mockConversationId, secondMessageData);
      
      // Second message should have parent_message_id set to first message ID
      expect(result.parent_message_id).toBe(firstMessage.id);
    });

    it('should maintain parent-child relationship in conversation thread', async () => {
      // Setup a mock conversation with multiple messages
      const mockMessages = [
        {
          id: 'msg-1',
          role: 'user',
          content: 'First message',
          conversation_id: mockConversationId,
          parent_message_id: null, // First message has no parent
          created_at: new Date(Date.now() - 300000).toISOString() // 5 minutes ago
        },
        {
          id: 'msg-2',
          role: 'assistant',
          content: 'Response to first',
          conversation_id: mockConversationId,
          parent_message_id: 'msg-1', // Points to first message
          created_at: new Date(Date.now() - 240000).toISOString() // 4 minutes ago
        },
        {
          id: 'msg-3',
          role: 'user',
          content: 'Follow-up question',
          conversation_id: mockConversationId,
          parent_message_id: 'msg-2', // Points to assistant response
          created_at: new Date(Date.now() - 180000).toISOString() // 3 minutes ago
        }
      ];
      
      // Mock the database service to return our mock data
      DbService.findWhere = vi.fn().mockImplementation((tableName, query, options) => {
        // Sort by created_at in the requested order
        const sorted = [...mockMessages].sort((a, b) => {
          const aTime = new Date(a.created_at).getTime();
          const bTime = new Date(b.created_at).getTime();
          return options.order === 'desc' ? bTime - aTime : aTime - bTime;
        });
        
        // Apply limit if specified
        const limited = options.limit ? sorted.slice(0, options.limit) : sorted;
        return Promise.resolve(limited);
      });
      
      // Get most recent message
      const mostRecent = await getMostRecentMessage(mockConversationId);
      
      // Verify it's the expected message
      expect(mostRecent.id).toBe('msg-3');
      
      // Verify its parent is correctly set
      expect(mostRecent.parent_message_id).toBe('msg-2');
      
      // Create new message without parent_message_id
      const newMessageData = {
        id: 'msg-4',
        role: 'assistant',
        content: 'New response',
        conversation_id: mockConversationId,
        created_at: new Date().toISOString()
      };
      
      // Verify parent gets set to most recent message
      const result = await verifyParentMessageId(mockConversationId, newMessageData);
      expect(result.parent_message_id).toBe('msg-3');
    });

    it('should handle case where specified parent_message_id does not exist', async () => {
      // Mock getMostRecentMessage
      const mockRecentMessage = {
        id: 'msg-valid-123',
        role: 'user',
        content: 'Valid message',
        conversation_id: mockConversationId,
        created_at: new Date(Date.now() - 60000).toISOString()
      };
      
      vi.mock('../../database/linkParentMessageId.js', () => ({
        getMostRecentMessage: vi.fn().mockResolvedValue(mockRecentMessage),
        verifyParentMessageId: vi.requireActual('../../database/linkParentMessageId.js').verifyParentMessageId
      }));
      
      // Mock DbService.exists to indicate parent doesn't exist
      DbService.exists = vi.fn().mockResolvedValue(false);
      
      // Message with invalid parent_message_id
      const messageData = {
        id: 'msg-new-456',
        role: 'user',
        content: 'New message with invalid parent',
        conversation_id: mockConversationId,
        parent_message_id: 'msg-nonexistent-999',
        created_at: new Date().toISOString()
      };
      
      // Import the real function (after mocking)
      const { verifyParentMessageId } = await import('../../database/linkParentMessageId.js');
      
      // Verify parent_message_id gets corrected
      const result = await verifyParentMessageId(mockConversationId, messageData);
      
      // Should fall back to most recent valid message
      expect(result.parent_message_id).toBe(mockRecentMessage.id);
    });
  });
}; 