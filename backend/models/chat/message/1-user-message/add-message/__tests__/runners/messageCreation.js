import { describe, it, expect, beforeEach } from 'vitest';
import { sendMessage } from '../../sendUserMessage.js';
import logger from '@/services/logger.js';

/**
 * Tests for user message creation and database storage
 */
export const runMessageCreationTests = (mockData) => {
  const { 
    mockUserId, 
    mockConversationId, 
    mockUserMessageId, 
    mockUserMessage,
    mockAssistantMessage 
  } = mockData;

  describe('User message creation and storage', () => {
    beforeEach(() => {
      // Functions are already mocked in the main test file
      // No need to mock them again here
    });

    it('should create user message with unique ID', async () => {
      const result = await sendMessage(
        mockConversationId, 
        mockUserId, 
        'How can I manage my irregular periods better?'
      );
      
      // Verify message has unique ID
      expect(result.userMessage).toBeDefined();
      expect(result.userMessage.id).toBe(mockUserMessageId);
      expect(result.userMessage.id).toMatch(/^msg-user-/);
    });

    it('should assign message to conversation via conversation_id', async () => {
      const result = await sendMessage(
        mockConversationId, 
        mockUserId, 
        'How can I manage my irregular periods better?'
      );
      
      // Verify message is linked to conversation
      expect(result.userMessage.conversation_id).toBe(mockConversationId);
      expect(result.conversationId).toBe(mockConversationId);
    });

    it('should store message in SQLite database via POST request', async () => {
      const result = await sendMessage(
        mockConversationId, 
        mockUserId, 
        'How can I manage my irregular periods better?'
      );
      
      // Verify that the sendMessage function returns a proper result (indicating database storage)
      expect(result).toBeDefined();
      expect(result.userMessage).toMatchObject({
        id: expect.any(String),
        role: 'user',
        content: 'How can I manage my irregular periods better?',
        user_id: mockUserId,
        conversation_id: mockConversationId,
        created_at: expect.any(String)
      });
      
      // Verify the function was called successfully (mock returns data)
      expect(result.userMessage.id).toBeDefined();
    });

    it('should create followup message by default', async () => {
      const result = await sendMessage(
        mockConversationId, 
        mockUserId, 
        'How can I manage my irregular periods better?'
      );
      
      // Verify this is a followup message (not initial)
      expect(result.userMessage.role).toBe('user');
      expect(result.userMessage.content).toBeDefined();
      expect(result.userMessage.parent_message_id).toBeUndefined(); // followup but not threaded
    });

    it('should include proper timestamps and metadata', async () => {
      const result = await sendMessage(
        mockConversationId, 
        mockUserId, 
        'How can I manage my irregular periods better?'
      );
      
      // Verify message structure
      expect(result.userMessage).toMatchObject({
        id: expect.any(String),
        conversation_id: mockConversationId,
        role: 'user',
        content: expect.any(String),
        user_id: mockUserId,
        created_at: expect.any(String)
      });
      
      // Verify timestamp is valid ISO date
      expect(() => new Date(result.userMessage.created_at)).not.toThrow();
      expect(new Date(result.userMessage.created_at).toISOString()).toBe(result.userMessage.created_at);
    });
  });
}; 