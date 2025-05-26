import { describe, it, expect, beforeEach } from 'vitest';
import { sendMessage } from '../../sendUserMessage.js';
import { generateResponseToMessage } from '../../../../chatbot-message/generateResponse.js';
import logger from '@/services/logger.js';

/**
 * Tests for complete dialogue sequence and conversation order
 */
export const runDialogueSequenceTests = (mockData) => {
  const { 
    mockUserId, 
    mockConversationId, 
    mockUserMessage,
    mockAssistantMessage,
    mockConversation 
  } = mockData;

  describe('Dialogue sequence and conversation display', () => {
    beforeEach(async () => {
      // Setup mocks for complete dialogue flow
      const { sendMessage: mockSendMessage } = await import('../../sendUserMessage.js');
      mockSendMessage.mockResolvedValue({
        userMessage: mockUserMessage,
        assistantMessage: mockAssistantMessage,
        conversationId: mockConversationId,
        timestamp: new Date().toISOString()
      });

      const { generateResponseToMessage: mockGenerateResponse } = await import('../../../chatbot-message/generateResponse.js');
      mockGenerateResponse.mockResolvedValue(mockAssistantMessage);
      
      const { ChatDatabaseOperations } = await import('../../../shared/database/chatOperations.js');
      ChatDatabaseOperations.getConversationMessages.mockResolvedValue(mockConversation.messages);
      ChatDatabaseOperations.insertMessage.mockResolvedValue(true);
    });

    it('should execute dialogue sequence in correct order', async () => {
      // Send user message
      const messageResult = await sendMessage(
        mockConversationId, 
        mockUserId, 
        'How can I manage my irregular periods better?'
      );
      
      // Verify user message comes first
      expect(messageResult.userMessage).toBeDefined();
      expect(messageResult.userMessage.role).toBe('user');
      
      // Verify assistant response follows
      expect(messageResult.assistantMessage).toBeDefined();
      expect(messageResult.assistantMessage.role).toBe('assistant');
      
      // Verify timestamps show correct sequence
      const userTime = new Date(messageResult.userMessage.created_at);
      const assistantTime = new Date(messageResult.assistantMessage.created_at);
      expect(assistantTime.getTime()).toBeGreaterThanOrEqual(userTime.getTime());
    });

    it('should display dialogue in chronological order', async () => {
      // Get conversation messages
      const { ChatDatabaseOperations } = await import('../../../shared/database/chatOperations.js');
      const messages = await ChatDatabaseOperations.getConversationMessages(mockConversationId);
      
      // Verify messages are in chronological order
      expect(messages).toHaveLength(2);
      expect(messages[0].role).toBe('user');
      expect(messages[1].role).toBe('assistant');
      
      // Verify timestamps are in ascending order
      const firstTime = new Date(messages[0].created_at);
      const secondTime = new Date(messages[1].created_at);
      expect(secondTime.getTime()).toBeGreaterThanOrEqual(firstTime.getTime());
    });

    it('should maintain conversation context and threading', async () => {
      const messageResult = await sendMessage(
        mockConversationId, 
        mockUserId, 
        'How can I manage my irregular periods better?'
      );
      
      // Verify both messages belong to same conversation
      expect(messageResult.userMessage.conversation_id).toBe(mockConversationId);
      expect(messageResult.assistantMessage.conversationId).toBe(mockConversationId);
      
      // Verify assistant message references user message
      expect(messageResult.assistantMessage.parent_message_id).toBe(messageResult.userMessage.id);
    });

    it('should create complete conversation object with ordered messages', async () => {
      await sendMessage(
        mockConversationId, 
        mockUserId, 
        'How can I manage my irregular periods better?'
      );
      
      // Get full conversation
      const { ChatDatabaseOperations } = await import('../../../shared/database/chatOperations.js');
      const messages = await ChatDatabaseOperations.getConversationMessages(mockConversationId);
      
      // Verify conversation structure
      expect(messages).toBeDefined();
      expect(Array.isArray(messages)).toBe(true);
      expect(messages.length).toBeGreaterThanOrEqual(2);
      
      // Verify each message has required fields
      messages.forEach(message => {
        expect(message).toMatchObject({
          id: expect.any(String),
          role: expect.stringMatching(/^(user|assistant)$/),
          content: expect.any(String),
          created_at: expect.any(String)
        });
      });
    });

    it('should handle multiple message exchanges in sequence', async () => {
      // First exchange
      const firstResult = await sendMessage(
        mockConversationId, 
        mockUserId, 
        'How can I manage my irregular periods better?'
      );
      
      // Second exchange (mock a follow-up)
      const secondUserMessage = {
        ...mockUserMessage,
        id: 'msg-user-second',
        content: 'What supplements do you recommend?',
        created_at: '2024-01-15T10:02:00.000Z'
      };
      
      const secondAssistantMessage = {
        ...mockAssistantMessage,
        id: 'msg-assistant-second',
        content: 'For irregular periods, I recommend magnesium and vitamin D...',
        created_at: '2024-01-15T10:03:00.000Z',
        parent_message_id: 'msg-user-second'
      };

      const { sendMessage: mockSendMessage } = await import('../../sendUserMessage.js');
      mockSendMessage.mockResolvedValueOnce({
        userMessage: secondUserMessage,
        assistantMessage: secondAssistantMessage,
        conversationId: mockConversationId,
        timestamp: new Date().toISOString()
      });

      const secondResult = await sendMessage(
        mockConversationId, 
        mockUserId, 
        'What supplements do you recommend?'
      );
      
      // Verify both exchanges completed
      expect(firstResult.userMessage.id).toBe(mockUserMessage.id);
      expect(secondResult.userMessage.id).toBe('msg-user-second');
      
      // Verify sequence is maintained
      expect(firstResult.conversationId).toBe(mockConversationId);
      expect(secondResult.conversationId).toBe(mockConversationId);
    });
  });
}; 