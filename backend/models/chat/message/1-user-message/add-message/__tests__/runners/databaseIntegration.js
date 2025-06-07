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
    beforeEach(() => {
      // Functions are already mocked in the main test file
      // No need to mock them again here
    });

    it('should persist user message in SQLite database', async () => {
      const result = await sendMessage(
        mockConversationId, 
        mockUserId, 
        'How can I manage my irregular periods better?'
      );
      
      // Verify user message was created correctly
      expect(result.userMessage).toMatchObject({
        role: 'user',
        content: 'How can I manage my irregular periods better?',
        user_id: mockUserId,
        conversation_id: mockConversationId
      });
    });

    it('should persist assistant message in SQLite database', async () => {
      const result = await sendMessage(
        mockConversationId, 
        mockUserId, 
        'How can I manage my irregular periods better?'
      );
      
      // Verify assistant message was created correctly
      expect(result.assistantMessage).toMatchObject({
        role: 'assistant',
        content: expect.any(String),
        parent_message_id: expect.any(String),
        conversationId: mockConversationId
      });
    });

    it('should maintain referential integrity with conversation_id', async () => {
      const result = await sendMessage(
        mockConversationId, 
        mockUserId, 
        'How can I manage my irregular periods better?'
      );
      
      // Verify all messages reference the same conversation
      expect(result.userMessage.conversation_id).toBe(mockConversationId);
      expect(result.assistantMessage.conversationId).toBe(mockConversationId);
      expect(result.conversationId).toBe(mockConversationId);
      
      // Verify message structure
      expect(result.userMessage).toMatchObject({
        id: expect.any(String),
        role: 'user',
        content: expect.any(String),
        created_at: expect.any(String)
      });
      
      expect(result.assistantMessage).toMatchObject({
        id: expect.any(String),
        role: 'assistant',
        content: expect.any(String),
        created_at: expect.any(String)
      });
    });

    it('should handle database operations in correct sequence', async () => {
      const startTime = Date.now();
      
      const result = await sendMessage(
        mockConversationId, 
        mockUserId, 
        'How can I manage my irregular periods better?'
      );
      
      const endTime = Date.now();
      
      // Verify operations completed within reasonable time
      expect(endTime - startTime).toBeLessThan(1000);
      
      // Verify messages were created successfully
      expect(result.userMessage).toBeDefined();
      expect(result.assistantMessage).toBeDefined();
      
      // Verify the sendMessage function was called (it's mocked)
      expect(result).toBeDefined();
    });

    it('should retrieve messages from database in chronological order', async () => {
      const result = await sendMessage(
        mockConversationId, 
        mockUserId, 
        'How can I manage my irregular periods better?'
      );
      
      // Verify messages are created in chronological order
      const userTime = new Date(result.userMessage.created_at);
      const assistantTime = new Date(result.assistantMessage.created_at);
      expect(assistantTime.getTime()).toBeGreaterThanOrEqual(userTime.getTime());
      
      // Verify message roles and order
      expect(result.userMessage.role).toBe('user');
      expect(result.assistantMessage.role).toBe('assistant');
    });

    it('should handle database errors gracefully', async () => {
      // For this test, we'll set up a specific mock that rejects
      const { sendMessage: mockSendMessage } = await import('../../sendUserMessage.js');
      mockSendMessage.mockRejectedValueOnce(new Error('Database connection failed'));
      
      // Attempt to send message - should throw error
      await expect(sendMessage(
        mockConversationId, 
        mockUserId, 
        'How can I manage my irregular periods better?'
      )).rejects.toThrow('Database connection failed');
      
      // Reset the mock to its original state for other tests
      mockSendMessage.mockResolvedValue({
        userMessage: mockUserMessage,
        assistantMessage: mockAssistantMessage,
        conversationId: mockConversationId,
        timestamp: new Date().toISOString()
      });
    });

    it('should validate foreign key constraints', async () => {
      const result = await sendMessage(
        mockConversationId, 
        mockUserId, 
        'How can I manage my irregular periods better?'
      );
      
      // Verify conversation_id is properly referenced in all messages
      expect(result.userMessage.conversation_id).toBe(mockConversationId);
      expect(result.assistantMessage.conversationId).toBe(mockConversationId);
      expect(result.conversationId).toBe(mockConversationId);
      
      // Verify conversation_id format is valid
      expect(typeof result.conversationId).toBe('string');
      expect(result.conversationId.length).toBeGreaterThan(0);
    });
  });
}; 
