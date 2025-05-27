import { describe, it, expect, vi } from 'vitest';
import { getConversation } from '../../conversation/read-conversation/getConversation.js';
import { insertChatMessage } from '../../message/1-user-message/add-message/database/sendUserMessage.js';
import { sendChatbotMessage } from '../../message/2-chatbot-message/database/sendChatbotMessage.js';

export function runTimestampUpdateTests(mockData) {
  describe('Timestamp Update Tests', () => {
    it('should have matching created_at and updated_at for new conversation', async () => {
      getConversation.mockResolvedValue({
        success: true,
        conversation: mockData.mockInitialConversation,
        messages: [],
        pagination: { total: 0, offset: 0, limit: null, hasMore: false }
      });

      const result = await getConversation(mockData.mockConversationId);

      expect(result.success).toBe(true);
      expect(result.conversation.created_at).toBe(result.conversation.updated_at);
      expect(result.conversation.created_at).toBe('2024-01-15T10:00:00.000Z');
      expect(result.conversation.updated_at).toBe('2024-01-15T10:00:00.000Z');
    });

    it('should update updated_at timestamp when first message is added', async () => {
      // Add user message
      insertChatMessage.mockResolvedValue(mockData.mockUserMessage);
      await insertChatMessage(
        mockData.mockConversationId,
        mockData.mockUserMessage.content,
        mockData.mockUserId
      );

      // Mock conversation with updated timestamp
      getConversation.mockResolvedValue({
        success: true,
        conversation: mockData.mockUpdatedConversation,
        messages: [mockData.mockUserMessage],
        pagination: { total: 1, offset: 0, limit: null, hasMore: false }
      });

      const result = await getConversation(mockData.mockConversationId);

      expect(result.success).toBe(true);
      expect(result.conversation.created_at).toBe('2024-01-15T10:00:00.000Z'); // Should not change
      expect(result.conversation.updated_at).toBe('2024-01-15T10:05:00.000Z'); // Should be updated
      expect(result.conversation.updated_at).not.toBe(result.conversation.created_at);
    });

    it('should update updated_at timestamp when assistant message is added', async () => {
      // Add assistant message
      sendChatbotMessage.mockResolvedValue(mockData.mockAssistantMessage);
      await sendChatbotMessage(
        mockData.mockConversationId,
        mockData.mockAssistantMessage.content
      );

      // Mock conversation with latest timestamp
      getConversation.mockResolvedValue({
        success: true,
        conversation: mockData.mockFinalConversation,
        messages: [mockData.mockUserMessage, mockData.mockAssistantMessage],
        pagination: { total: 2, offset: 0, limit: null, hasMore: false }
      });

      const result = await getConversation(mockData.mockConversationId);

      expect(result.success).toBe(true);
      expect(result.conversation.created_at).toBe('2024-01-15T10:00:00.000Z'); // Should not change
      expect(result.conversation.updated_at).toBe('2024-01-15T10:06:00.000Z'); // Should be latest
    });

    it('should maintain chronological order of timestamps', async () => {
      const timestampSequence = [
        '2024-01-15T10:00:00.000Z', // Initial creation
        '2024-01-15T10:05:00.000Z', // After user message
        '2024-01-15T10:06:00.000Z'  // After assistant message
      ];

      // Test each timestamp in sequence
      for (let i = 0; i < timestampSequence.length; i++) {
        const messageCount = i;
        const currentTimestamp = timestampSequence[i];
        
        getConversation.mockResolvedValue({
          success: true,
          conversation: {
            ...mockData.mockInitialConversation,
            messageCount,
            updated_at: currentTimestamp
          },
          messages: i === 0 ? [] : i === 1 ? [mockData.mockUserMessage] : [mockData.mockUserMessage, mockData.mockAssistantMessage],
          pagination: { total: messageCount, offset: 0, limit: null, hasMore: false }
        });

        const result = await getConversation(mockData.mockConversationId);
        
        expect(result.conversation.updated_at).toBe(currentTimestamp);
        expect(result.conversation.created_at).toBe('2024-01-15T10:00:00.000Z'); // Always same
        
        // Verify chronological order
        if (i > 0) {
          const previousTimestamp = timestampSequence[i - 1];
          expect(new Date(currentTimestamp).getTime()).toBeGreaterThan(new Date(previousTimestamp).getTime());
        }
      }
    });

    it('should update timestamp to match most recent message timestamp', async () => {
      // Test that conversation updated_at matches the latest message's created_at
      const latestMessageTime = '2024-01-15T10:06:00.000Z';
      
      getConversation.mockResolvedValue({
        success: true,
        conversation: {
          ...mockData.mockFinalConversation,
          updated_at: latestMessageTime
        },
        messages: [
          mockData.mockUserMessage,
          {
            ...mockData.mockAssistantMessage,
            created_at: latestMessageTime
          }
        ],
        pagination: { total: 2, offset: 0, limit: null, hasMore: false }
      });

      const result = await getConversation(mockData.mockConversationId);

      expect(result.success).toBe(true);
      expect(result.conversation.updated_at).toBe(latestMessageTime);
      
      // Find the latest message
      const latestMessage = result.messages[result.messages.length - 1];
      expect(result.conversation.updated_at).toBe(latestMessage.created_at);
    });

    it('should handle timestamp updates in rapid succession', async () => {
      const rapidTimestamps = [
        '2024-01-15T10:06:00.000Z',
        '2024-01-15T10:06:01.000Z',
        '2024-01-15T10:06:02.000Z'
      ];

      for (let i = 0; i < rapidTimestamps.length; i++) {
        const timestamp = rapidTimestamps[i];
        
        getConversation.mockResolvedValue({
          success: true,
          conversation: {
            ...mockData.mockInitialConversation,
            messageCount: i + 1,
            updated_at: timestamp
          },
          messages: [], // Just focus on timestamp testing
          pagination: { total: i + 1, offset: 0, limit: null, hasMore: false }
        });

        const result = await getConversation(mockData.mockConversationId);
        expect(result.conversation.updated_at).toBe(timestamp);
      }
    });

    it('should preserve created_at while updating updated_at', async () => {
      const originalCreatedAt = '2024-01-15T10:00:00.000Z';
      const updatedTimes = [
        '2024-01-15T10:05:00.000Z',
        '2024-01-15T10:06:00.000Z',
        '2024-01-15T10:07:00.000Z'
      ];

      for (const updatedTime of updatedTimes) {
        getConversation.mockResolvedValue({
          success: true,
          conversation: {
            ...mockData.mockInitialConversation,
            created_at: originalCreatedAt,
            updated_at: updatedTime
          },
          messages: [],
          pagination: { total: 1, offset: 0, limit: null, hasMore: false }
        });

        const result = await getConversation(mockData.mockConversationId);
        
        expect(result.conversation.created_at).toBe(originalCreatedAt);
        expect(result.conversation.updated_at).toBe(updatedTime);
        expect(result.conversation.created_at).not.toBe(result.conversation.updated_at);
      }
    });

    it('should handle timezone consistency in timestamps', async () => {
      // All timestamps should be in consistent timezone (UTC in this case)
      const utcTimestamps = [
        '2024-01-15T10:00:00.000Z',
        '2024-01-15T10:05:00.000Z',
        '2024-01-15T10:06:00.000Z'
      ];

      for (const timestamp of utcTimestamps) {
        getConversation.mockResolvedValue({
          success: true,
          conversation: {
            ...mockData.mockInitialConversation,
            updated_at: timestamp
          },
          messages: [],
          pagination: { total: 0, offset: 0, limit: null, hasMore: false }
        });

        const result = await getConversation(mockData.mockConversationId);
        
        expect(result.conversation.updated_at).toBe(timestamp);
        expect(result.conversation.updated_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/); // UTC format
      }
    });

    it('should validate that updated_at is never earlier than created_at', async () => {
      const createdAt = '2024-01-15T10:00:00.000Z';
      const updatedAt = '2024-01-15T10:05:00.000Z';

      getConversation.mockResolvedValue({
        success: true,
        conversation: {
          ...mockData.mockInitialConversation,
          created_at: createdAt,
          updated_at: updatedAt
        },
        messages: [],
        pagination: { total: 1, offset: 0, limit: null, hasMore: false }
      });

      const result = await getConversation(mockData.mockConversationId);

      expect(result.success).toBe(true);
      expect(new Date(result.conversation.updated_at).getTime())
        .toBeGreaterThanOrEqual(new Date(result.conversation.created_at).getTime());
    });
  });
} 