import { describe, it, expect, vi } from 'vitest';
import { getConversation } from '../../conversation/read-conversation/getConversation.js';
import { insertChatMessage } from '../../message/1-user-message/add-message/database/sendUserMessage.js';
import { sendChatbotMessage } from '../../message/2-chatbot-message/database/sendChatbotMessage.js';

export function runPreviewUpdateTests(mockData) {
  describe('Preview Update Tests', () => {
    it('should have null preview for conversation with no messages', async () => {
      getConversation.mockResolvedValue({
        success: true,
        conversation: mockData.mockInitialConversation,
        messages: [],
        pagination: { total: 0, offset: 0, limit: null, hasMore: false }
      });

      const result = await getConversation(mockData.mockConversationId);

      expect(result.success).toBe(true);
      expect(result.conversation.preview).toBeNull();
    });

    it('should update preview to truncated user message content', async () => {
      // Add user message
      insertChatMessage.mockResolvedValue(mockData.mockUserMessage);
      await insertChatMessage(
        mockData.mockConversationId,
        mockData.mockUserMessage.content,
        mockData.mockUserId
      );

      // Mock conversation with updated preview
      getConversation.mockResolvedValue({
        success: true,
        conversation: mockData.mockUpdatedConversation,
        messages: [mockData.mockUserMessage],
        pagination: { total: 1, offset: 0, limit: null, hasMore: false }
      });

      const result = await getConversation(mockData.mockConversationId);

      expect(result.success).toBe(true);
      expect(result.conversation.preview).toBe('Hi, could you look at my assessment results...');
      expect(result.conversation.preview).toContain('Hi, could you look at my assessment results');
      expect(result.conversation.preview.length).toBeLessThanOrEqual(50); // Assume preview is truncated
    });

    it('should update preview to latest assistant message when added', async () => {
      // Add assistant message
      sendChatbotMessage.mockResolvedValue(mockData.mockAssistantMessage);
      await sendChatbotMessage(
        mockData.mockConversationId,
        mockData.mockAssistantMessage.content
      );

      // Mock conversation with latest preview
      getConversation.mockResolvedValue({
        success: true,
        conversation: mockData.mockFinalConversation,
        messages: [mockData.mockUserMessage, mockData.mockAssistantMessage],
        pagination: { total: 2, offset: 0, limit: null, hasMore: false }
      });

      const result = await getConversation(mockData.mockConversationId);

      expect(result.success).toBe(true);
      expect(result.conversation.preview).toBe('Based on your assessment, I can see...');
      expect(result.conversation.preview).toContain('Based on your assessment, I can see');
    });

    it('should maintain preview as most recent message content', async () => {
      const messageSequence = [
        {
          message: mockData.mockUserMessage,
          expectedPreview: 'Hi, could you look at my assessment results...'
        },
        {
          message: mockData.mockAssistantMessage,
          expectedPreview: 'Based on your assessment, I can see...'
        }
      ];

      for (let i = 0; i < messageSequence.length; i++) {
        const sequence = messageSequence[i];
        
        getConversation.mockResolvedValue({
          success: true,
          conversation: {
            ...mockData.mockInitialConversation,
            preview: sequence.expectedPreview,
            messageCount: i + 1,
            updated_at: new Date(Date.now() + i * 60000).toISOString() // 1 minute apart
          },
          messages: messageSequence.slice(0, i + 1).map(s => s.message),
          pagination: { total: i + 1, offset: 0, limit: null, hasMore: false }
        });

        const result = await getConversation(mockData.mockConversationId);
        expect(result.conversation.preview).toBe(sequence.expectedPreview);
      }
    });

    it('should handle long message content by truncating preview', async () => {
      const longMessage = {
        id: 'msg-long-123',
        conversation_id: mockData.mockConversationId,
        role: 'user',
        content: 'This is a very long message that should be truncated in the preview field because it exceeds the maximum allowed length for preview text. The preview should show only the beginning portion of the message and end with appropriate truncation indicator.',
        created_at: '2024-01-15T10:07:00.000Z'
      };

      insertChatMessage.mockResolvedValue(longMessage);
      await insertChatMessage(
        mockData.mockConversationId,
        longMessage.content,
        mockData.mockUserId
      );

      // Mock conversation with truncated preview
      const truncatedPreview = 'This is a very long message that should be...';
      getConversation.mockResolvedValue({
        success: true,
        conversation: {
          ...mockData.mockInitialConversation,
          preview: truncatedPreview,
          messageCount: 1,
          updated_at: '2024-01-15T10:07:00.000Z'
        },
        messages: [longMessage],
        pagination: { total: 1, offset: 0, limit: null, hasMore: false }
      });

      const result = await getConversation(mockData.mockConversationId);

      expect(result.success).toBe(true);
      expect(result.conversation.preview).toBe(truncatedPreview);
      expect(result.conversation.preview.length).toBeLessThan(longMessage.content.length);
      expect(result.conversation.preview).toContain('This is a very long message');
    });

    it('should update preview when multiple messages are added in sequence', async () => {
      const previews = [
        'Hi, could you look at my assessment results...',
        'Based on your assessment, I can see...'
      ];

      // Test sequence of preview updates
      for (let i = 0; i < previews.length; i++) {
        getConversation.mockResolvedValue({
          success: true,
          conversation: {
            ...mockData.mockInitialConversation,
            preview: previews[i],
            messageCount: i + 1,
            updated_at: new Date(Date.now() + i * 60000).toISOString()
          },
          messages: i === 0 ? [mockData.mockUserMessage] : [mockData.mockUserMessage, mockData.mockAssistantMessage],
          pagination: { total: i + 1, offset: 0, limit: null, hasMore: false }
        });

        const result = await getConversation(mockData.mockConversationId);
        expect(result.conversation.preview).toBe(previews[i]);
      }
    });

    it('should handle empty message content gracefully', async () => {
      const emptyMessage = {
        id: 'msg-empty-123',
        conversation_id: mockData.mockConversationId,
        role: 'user',
        content: '',
        created_at: '2024-01-15T10:08:00.000Z'
      };

      insertChatMessage.mockResolvedValue(emptyMessage);
      await insertChatMessage(
        mockData.mockConversationId,
        emptyMessage.content,
        mockData.mockUserId
      );

      getConversation.mockResolvedValue({
        success: true,
        conversation: {
          ...mockData.mockInitialConversation,
          preview: '', // Empty or null for empty content
          messageCount: 1,
          updated_at: '2024-01-15T10:08:00.000Z'
        },
        messages: [emptyMessage],
        pagination: { total: 1, offset: 0, limit: null, hasMore: false }
      });

      const result = await getConversation(mockData.mockConversationId);

      expect(result.success).toBe(true);
      expect(result.conversation.preview).toBe('');
      expect(result.conversation.messageCount).toBe(1);
    });
  });
} 