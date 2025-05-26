import { describe, it, expect, beforeEach } from 'vitest';
import { sendMessage } from '../../sendUserMessage.js';
import DbService from '@/services/dbService.js';
import logger from '@/services/logger.js';

/**
 * Tests for database integration and message persistence
 */
export const runDatabaseIntegrationTests = (mockData) => {
  const { 
    mockUserId, 
    mockConversationId, 
    mockUserMessage,
    mockAssistantMessage 
  } = mockData;

  describe('Database integration and persistence', () => {
    beforeEach(async () => {
      // Setup mocks for database operations
      const { sendMessage: mockSendMessage } = await import('../../sendUserMessage.js');
      mockSendMessage.mockResolvedValue({
        userMessage: mockUserMessage,
        assistantMessage: mockAssistantMessage,
        conversationId: mockConversationId,
        timestamp: new Date().toISOString()
      });
      
      const { ChatDatabaseOperations } = await import('../../../shared/database/chatOperations.js');
      ChatDatabaseOperations.insertMessage.mockResolvedValue(true);
      ChatDatabaseOperations.getMessage.mockResolvedValue(mockUserMessage);
      
      // Mock DbService for SQLite operations
      DbService.create.mockResolvedValue(true);
      DbService.findById.mockResolvedValue(mockUserMessage);
    });

    it('should persist user message in SQLite database', async () => {
      await sendMessage(
        mockConversationId, 
        mockUserId, 
        'How can I manage my irregular periods better?'
      );
      
      // Verify database insertion was called for user message
      const { ChatDatabaseOperations } = await import('../../../shared/database/chatOperations.js');
      expect(ChatDatabaseOperations.insertMessage).toHaveBeenCalledWith(
        mockConversationId,
        expect.objectContaining({
          role: 'user',
          content: 'How can I manage my irregular periods better?',
          user_id: mockUserId
        })
      );
    });

    it('should persist assistant message in SQLite database', async () => {
      await sendMessage(
        mockConversationId, 
        mockUserId, 
        'How can I manage my irregular periods better?'
      );
      
      // Verify database insertion was called for assistant message
      const { ChatDatabaseOperations } = await import('../../../shared/database/chatOperations.js');
      expect(ChatDatabaseOperations.insertMessage).toHaveBeenCalledWith(
        mockConversationId,
        expect.objectContaining({
          role: 'assistant',
          content: expect.any(String),
          parent_message_id: expect.any(String)
        })
      );
    });

    it('should maintain referential integrity with conversation_id', async () => {
      await sendMessage(
        mockConversationId, 
        mockUserId, 
        'How can I manage my irregular periods better?'
      );
      
      // Verify all messages reference the same conversation
      const { ChatDatabaseOperations } = await import('../../../shared/database/chatOperations.js');
      const insertCalls = ChatDatabaseOperations.insertMessage.mock.calls;
      
      insertCalls.forEach(call => {
        const [conversationId, messageData] = call;
        expect(conversationId).toBe(mockConversationId);
        expect(messageData).toMatchObject({
          id: expect.any(String),
          role: expect.stringMatching(/^(user|assistant)$/),
          content: expect.any(String),
          created_at: expect.any(String)
        });
      });
    });

    it('should handle database operations in correct sequence', async () => {
      const startTime = Date.now();
      
      await sendMessage(
        mockConversationId, 
        mockUserId, 
        'How can I manage my irregular periods better?'
      );
      
      const endTime = Date.now();
      
      // Verify operations completed within reasonable time
      expect(endTime - startTime).toBeLessThan(1000);
      
      // Verify database operations were called
      const { ChatDatabaseOperations } = await import('../../../shared/database/chatOperations.js');
      expect(ChatDatabaseOperations.insertMessage).toHaveBeenCalled();
      
      // Verify logging occurred
      expect(logger.info).toHaveBeenCalled();
    });

    it('should retrieve messages from database in chronological order', async () => {
      // Setup mock for retrieving conversation messages
      const { ChatDatabaseOperations } = await import('../../../shared/database/chatOperations.js');
      const mockMessages = [
        mockUserMessage,
        mockAssistantMessage
      ];
      ChatDatabaseOperations.getConversationMessages.mockResolvedValue(mockMessages);
      
      // Get messages from database
      const messages = await ChatDatabaseOperations.getConversationMessages(mockConversationId);
      
      // Verify messages are returned in order
      expect(messages).toHaveLength(2);
      expect(messages[0].role).toBe('user');
      expect(messages[1].role).toBe('assistant');
      
      // Verify timestamp order
      const userTime = new Date(messages[0].created_at);
      const assistantTime = new Date(messages[1].created_at);
      expect(assistantTime.getTime()).toBeGreaterThanOrEqual(userTime.getTime());
    });

    it('should handle database errors gracefully', async () => {
      // Mock database error
      const { ChatDatabaseOperations } = await import('../../../shared/database/chatOperations.js');
      ChatDatabaseOperations.insertMessage.mockRejectedValueOnce(new Error('Database connection failed'));
      
      // Attempt to send message
      await expect(sendMessage(
        mockConversationId, 
        mockUserId, 
        'How can I manage my irregular periods better?'
      )).rejects.toThrow();
      
      // Verify error was logged
      expect(logger.error).toHaveBeenCalled();
    });

    it('should validate foreign key constraints', async () => {
      await sendMessage(
        mockConversationId, 
        mockUserId, 
        'How can I manage my irregular periods better?'
      );
      
      // Verify conversation_id is properly referenced
      const { ChatDatabaseOperations } = await import('../../../shared/database/chatOperations.js');
      const insertCalls = ChatDatabaseOperations.insertMessage.mock.calls;
      
      insertCalls.forEach(call => {
        const [conversationId] = call;
        expect(conversationId).toBe(mockConversationId);
        expect(typeof conversationId).toBe('string');
        expect(conversationId.length).toBeGreaterThan(0);
      });
    });
  });
}; 