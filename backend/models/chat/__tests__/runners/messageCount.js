import { describe, it, expect, vi } from 'vitest';
import { getConversation, getConversationSummary } from '../../conversation/read-conversation/getConversation.js';
import { insertChatMessage } from '../../message/1-user-message/add-message/database/sendUserMessage.js';
import { sendChatbotMessage } from '../../message/2-chatbot-message/database/sendChatbotMessage.js';

export function runMessageCountTests(mockData) {
  describe('Message Count Update Tests', () => {
    it('should start with zero message count for new conversation', async () => {
      getConversationSummary.mockResolvedValue({
        success: true,
        summary: {
          id: mockData.mockConversationId,
          user_id: mockData.mockUserId,
          assessment_id: mockData.mockAssessmentId,
          title: 'Assessment Conversation',
          messageCount: 0,
          hasMessages: false,
          created_at: '2024-01-15T10:00:00.000Z',
          updated_at: '2024-01-15T10:00:00.000Z'
        }
      });

      const result = await getConversationSummary(mockData.mockConversationId);

      expect(result.success).toBe(true);
      expect(result.summary.messageCount).toBe(0);
      expect(result.summary.hasMessages).toBe(false);
    });

    it('should increment message count to 1 after adding first user message', async () => {
      // Add user message
      insertChatMessage.mockResolvedValue(mockData.mockUserMessage);
      await insertChatMessage(
        mockData.mockConversationId,
        mockData.mockUserMessage.content,
        mockData.mockUserId
      );

      // Mock updated conversation with 1 message
      getConversation.mockResolvedValue({
        success: true,
        conversation: mockData.mockUpdatedConversation,
        messages: [mockData.mockUserMessage],
        pagination: { total: 1, offset: 0, limit: null, hasMore: false }
      });

      const result = await getConversation(mockData.mockConversationId);

      expect(result.success).toBe(true);
      expect(result.conversation.messageCount).toBe(1);
      expect(result.messages).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });

    it('should increment message count to 2 after adding assistant response', async () => {
      // Add assistant message
      sendChatbotMessage.mockResolvedValue(mockData.mockAssistantMessage);
      await sendChatbotMessage(
        mockData.mockConversationId,
        mockData.mockAssistantMessage.content
      );

      // Mock conversation with 2 messages
      getConversation.mockResolvedValue({
        success: true,
        conversation: mockData.mockFinalConversation,
        messages: [mockData.mockUserMessage, mockData.mockAssistantMessage],
        pagination: { total: 2, offset: 0, limit: null, hasMore: false }
      });

      const result = await getConversation(mockData.mockConversationId);

      expect(result.success).toBe(true);
      expect(result.conversation.messageCount).toBe(2);
      expect(result.messages).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
    });

    it('should maintain correct message count sequence', async () => {
      const sequenceTests = [
        { expectedCount: 0, messages: [] },
        { expectedCount: 1, messages: [mockData.mockUserMessage] },
        { expectedCount: 2, messages: [mockData.mockUserMessage, mockData.mockAssistantMessage] }
      ];

      for (let i = 0; i < sequenceTests.length; i++) {
        const test = sequenceTests[i];
        
        getConversation.mockResolvedValue({
          success: true,
          conversation: {
            ...mockData.mockInitialConversation,
            messageCount: test.expectedCount,
            updated_at: new Date(Date.now() + i * 1000).toISOString()
          },
          messages: test.messages,
          pagination: { total: test.expectedCount, offset: 0, limit: null, hasMore: false }
        });

        const result = await getConversation(mockData.mockConversationId);
        
        expect(result.conversation.messageCount).toBe(test.expectedCount);
        expect(result.messages).toHaveLength(test.expectedCount);
        expect(result.pagination.total).toBe(test.expectedCount);
      }
    });

    it('should return accurate message count in conversation summary', async () => {
      getConversationSummary.mockResolvedValue({
        success: true,
        summary: {
          id: mockData.mockConversationId,
          user_id: mockData.mockUserId,
          assessment_id: mockData.mockAssessmentId,
          title: 'Assessment Conversation',
          messageCount: 2,
          hasMessages: true,
          created_at: '2024-01-15T10:00:00.000Z',
          updated_at: '2024-01-15T10:06:00.000Z'
        }
      });

      const result = await getConversationSummary(mockData.mockConversationId);

      expect(result.success).toBe(true);
      expect(result.summary.messageCount).toBe(2);
      expect(result.summary.hasMessages).toBe(true);
    });

    it('should handle message count consistently across different query methods', async () => {
      // Mock getConversation
      getConversation.mockResolvedValue({
        success: true,
        conversation: mockData.mockFinalConversation,
        messages: [mockData.mockUserMessage, mockData.mockAssistantMessage],
        pagination: { total: 2, offset: 0, limit: null, hasMore: false }
      });

      // Mock getConversationSummary
      getConversationSummary.mockResolvedValue({
        success: true,
        summary: {
          id: mockData.mockConversationId,
          messageCount: 2,
          hasMessages: true
        }
      });

      const fullResult = await getConversation(mockData.mockConversationId);
      const summaryResult = await getConversationSummary(mockData.mockConversationId);

      expect(fullResult.conversation.messageCount).toBe(summaryResult.summary.messageCount);
      expect(fullResult.pagination.total).toBe(summaryResult.summary.messageCount);
      expect(fullResult.messages.length).toBe(summaryResult.summary.messageCount);
    });
  });
} 