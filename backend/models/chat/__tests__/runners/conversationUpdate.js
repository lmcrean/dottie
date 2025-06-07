import { describe, it, expect, vi } from 'vitest';
import { getConversation } from '../../conversation/read-conversation/getConversation.js';
import { insertChatMessage } from '../../message/1-user-message/add-message/database/sendUserMessage.js';

export function runConversationUpdateTests(mockData) {
  describe('Conversation Update Tests', () => {
    it('should retrieve conversation before adding message', async () => {
      // Mock initial conversation state
      getConversation.mockResolvedValue({
        success: true,
        conversation: mockData.mockInitialConversation,
        messages: [],
        pagination: { total: 0, offset: 0, limit: null, hasMore: false }
      });

      const result = await getConversation(mockData.mockConversationId);

      expect(result.success).toBe(true);
      expect(result.conversation.id).toBe(mockData.mockConversationId);
      expect(result.conversation.messageCount).toBe(0);
      expect(result.conversation.preview).toBeNull();
      expect(getConversation).toHaveBeenCalledWith(mockData.mockConversationId);
    });

    it('should add user message to conversation', async () => {
      // Mock message insertion
      insertChatMessage.mockResolvedValue(mockData.mockUserMessage);

      const result = await insertChatMessage(
        mockData.mockConversationId,
        mockData.mockUserMessage.content,
        mockData.mockUserId
      );

      expect(result.id).toBe(mockData.mockUserMessage.id);
      expect(result.conversation_id).toBe(mockData.mockConversationId);
      expect(result.role).toBe('user');
      expect(result.content).toBe(mockData.mockUserMessage.content);
      expect(insertChatMessage).toHaveBeenCalledWith(
        mockData.mockConversationId,
        mockData.mockUserMessage.content,
        mockData.mockUserId
      );
    });

    it('should retrieve updated conversation after adding message', async () => {
      // Mock updated conversation state
      getConversation.mockResolvedValue({
        success: true,
        conversation: mockData.mockUpdatedConversation,
        messages: [mockData.mockUserMessage],
        pagination: { total: 1, offset: 0, limit: null, hasMore: false }
      });

      const result = await getConversation(mockData.mockConversationId);

      expect(result.success).toBe(true);
      expect(result.conversation.messageCount).toBe(1);
      expect(result.conversation.preview).toBe('Hi, could you look at my assessment results...');
      expect(result.conversation.updated_at).toBe('2024-01-15T10:05:00.000Z');
      expect(result.messages).toHaveLength(1);
      expect(result.messages[0].role).toBe('user');
    });

    it('should verify conversation state changes after message addition', async () => {
      // First call - initial state
      getConversation
        .mockResolvedValueOnce({
          success: true,
          conversation: mockData.mockInitialConversation,
          messages: [],
          pagination: { total: 0, offset: 0, limit: null, hasMore: false }
        })
        // Second call - after message added
        .mockResolvedValueOnce({
          success: true,
          conversation: mockData.mockUpdatedConversation,
          messages: [mockData.mockUserMessage],
          pagination: { total: 1, offset: 0, limit: null, hasMore: false }
        });

      // Get initial state
      const initialResult = await getConversation(mockData.mockConversationId);
      expect(initialResult.conversation.messageCount).toBe(0);
      expect(initialResult.conversation.preview).toBeNull();

      // Add message (mocked)
      insertChatMessage.mockResolvedValue(mockData.mockUserMessage);
      await insertChatMessage(
        mockData.mockConversationId,
        mockData.mockUserMessage.content,
        mockData.mockUserId
      );

      // Get updated state
      const updatedResult = await getConversation(mockData.mockConversationId);
      
      // Verify changes
      expect(updatedResult.conversation.messageCount).toBe(1);
      expect(updatedResult.conversation.preview).toBeTruthy();
      expect(updatedResult.conversation.updated_at).not.toBe(initialResult.conversation.updated_at);
      expect(updatedResult.messages).toHaveLength(1);
    });

    it('should handle conversation not found error gracefully', async () => {
      getConversation.mockResolvedValue({
        success: false,
        error: 'Conversation not found',
        conversationId: 'invalid-id'
      });

      const result = await getConversation('invalid-id');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Conversation not found');
      expect(result.conversationId).toBe('invalid-id');
    });
  });
} 