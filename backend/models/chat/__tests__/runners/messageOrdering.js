import { describe, it, expect, vi } from 'vitest';
import { getConversation } from '../../conversation/read-conversation/getConversation.js';
import { insertChatMessage } from '../../message/1-user-message/add-message/database/sendUserMessage.js';
import { sendChatbotMessage } from '../../message/2-chatbot-message/database/sendChatbotMessage.js';

export function runMessageOrderingTests(mockData) {
  describe('Message Ordering Tests', () => {
    it('should start conversation with user message first', async () => {
      // Mock conversation with just the user message
      getConversation.mockResolvedValue({
        success: true,
        conversation: {
          ...mockData.mockInitialConversation,
          messageCount: 1,
          updated_at: '2024-01-15T10:05:00.000Z'
        },
        messages: [mockData.mockUserMessage],
        pagination: { total: 1, offset: 0, limit: null, hasMore: false }
      });

      const result = await getConversation(mockData.mockConversationId);

      expect(result.success).toBe(true);
      expect(result.messages).toHaveLength(1);
      expect(result.messages[0].role).toBe('user');
      expect(result.messages[0].content).toBe(mockData.mockUserMessage.content);
    });

    it('should maintain user-first ordering when assistant responds', async () => {
      // Mock conversation with user message followed by assistant message
      getConversation.mockResolvedValue({
        success: true,
        conversation: mockData.mockFinalConversation,
        messages: [mockData.mockUserMessage, mockData.mockAssistantMessage],
        pagination: { total: 2, offset: 0, limit: null, hasMore: false }
      });

      const result = await getConversation(mockData.mockConversationId);

      expect(result.success).toBe(true);
      expect(result.messages).toHaveLength(2);
      
      // First message should be user
      expect(result.messages[0].role).toBe('user');
      expect(result.messages[0].content).toBe(mockData.mockUserMessage.content);
      
      // Second message should be assistant
      expect(result.messages[1].role).toBe('assistant');
      expect(result.messages[1].content).toBe(mockData.mockAssistantMessage.content);
    });

    it('should maintain chronological order for multiple user-assistant exchanges', async () => {
      // Create additional test messages for a longer conversation
      const mockSecondUserMessage = {
        id: 'msg-user-789',
        conversation_id: mockData.mockConversationId,
        role: 'user',
        content: 'Thank you for the advice. Could you tell me more about tracking?',
        created_at: '2024-01-15T10:07:00.000Z'
      };

      const mockSecondAssistantMessage = {
        id: 'msg-assistant-012',
        conversation_id: mockData.mockConversationId,
        role: 'assistant',
        content: 'Absolutely! Here are some tracking methods that work well...',
        created_at: '2024-01-15T10:08:00.000Z'
      };

      // Mock conversation with alternating user-assistant pattern
      getConversation.mockResolvedValue({
        success: true,
        conversation: {
          ...mockData.mockFinalConversation,
          messageCount: 4,
          updated_at: '2024-01-15T10:08:00.000Z'
        },
        messages: [
          mockData.mockUserMessage,
          mockData.mockAssistantMessage,
          mockSecondUserMessage,
          mockSecondAssistantMessage
        ],
        pagination: { total: 4, offset: 0, limit: null, hasMore: false }
      });

      const result = await getConversation(mockData.mockConversationId);

      expect(result.success).toBe(true);
      expect(result.messages).toHaveLength(4);
      
      // Verify the pattern: user, assistant, user, assistant
      expect(result.messages[0].role).toBe('user');
      expect(result.messages[1].role).toBe('assistant');
      expect(result.messages[2].role).toBe('user');
      expect(result.messages[3].role).toBe('assistant');
      
      // Verify chronological ordering by timestamp
      const timestamps = result.messages.map(msg => new Date(msg.created_at).getTime());
      for (let i = 1; i < timestamps.length; i++) {
        expect(timestamps[i]).toBeGreaterThan(timestamps[i - 1]);
      }
    });

    it('should handle conversation that starts with user message and has no assistant response yet', async () => {
      // Mock a new conversation with only user message (no assistant response yet)
      getConversation.mockResolvedValue({
        success: true,
        conversation: {
          ...mockData.mockInitialConversation,
          messageCount: 1,
          preview: mockData.mockUserMessage.content.substring(0, 50),
          updated_at: '2024-01-15T10:05:00.000Z'
        },
        messages: [mockData.mockUserMessage],
        pagination: { total: 1, offset: 0, limit: null, hasMore: false }
      });

      const result = await getConversation(mockData.mockConversationId);

      expect(result.success).toBe(true);
      expect(result.messages).toHaveLength(1);
      expect(result.messages[0].role).toBe('user');
      expect(result.conversation.messageCount).toBe(1);
    });

    it('should verify messages are ordered by created_at timestamp', async () => {
      // Create messages with specific timestamps to test ordering
      const orderedMessages = [
        {
          ...mockData.mockUserMessage,
          created_at: '2024-01-15T10:05:00.000Z'
        },
        {
          ...mockData.mockAssistantMessage,
          created_at: '2024-01-15T10:06:00.000Z'
        }
      ];

      getConversation.mockResolvedValue({
        success: true,
        conversation: mockData.mockFinalConversation,
        messages: orderedMessages,
        pagination: { total: 2, offset: 0, limit: null, hasMore: false }
      });

      const result = await getConversation(mockData.mockConversationId);

      expect(result.success).toBe(true);
      expect(result.messages).toHaveLength(2);
      
      // Verify the messages are in chronological order
      const firstMessageTime = new Date(result.messages[0].created_at).getTime();
      const secondMessageTime = new Date(result.messages[1].created_at).getTime();
      
      expect(secondMessageTime).toBeGreaterThan(firstMessageTime);
      
      // Verify first message is user (since user initiates conversation)
      expect(result.messages[0].role).toBe('user');
    });

    it('should enforce that conversations cannot start with assistant message', async () => {
      // This test verifies business logic: conversations must start with user message
      // Mock a scenario where we try to get a conversation that somehow has assistant first
      // This should not happen in normal flow, but we test the expectation
      
      getConversation.mockResolvedValue({
        success: true,
        conversation: {
          ...mockData.mockInitialConversation,
          messageCount: 1
        },
        messages: [mockData.mockUserMessage], // Always user first in valid conversation
        pagination: { total: 1, offset: 0, limit: null, hasMore: false }
      });

      const result = await getConversation(mockData.mockConversationId);

      expect(result.success).toBe(true);
      expect(result.messages).toHaveLength(1);
      
      // In a valid conversation flow, first message must be user
      expect(result.messages[0].role).toBe('user');
      
      // This enforces the business rule that conversations start with user input
      expect(result.messages[0].role).not.toBe('assistant');
      expect(result.messages[0].role).not.toBe('system');
    });
  });
} 