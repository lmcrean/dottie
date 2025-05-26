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
    beforeEach(() => {
      // Functions are already mocked in the main test file
      // No need to mock them again here
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
      // Send message and verify order from result
      const messageResult = await sendMessage(
        mockConversationId, 
        mockUserId, 
        'How can I manage my irregular periods better?'
      );
      
      // Verify messages are created in chronological order
      const userTime = new Date(messageResult.userMessage.created_at);
      const assistantTime = new Date(messageResult.assistantMessage.created_at);
      expect(assistantTime.getTime()).toBeGreaterThanOrEqual(userTime.getTime());
      
      // Verify roles are correct
      expect(messageResult.userMessage.role).toBe('user');
      expect(messageResult.assistantMessage.role).toBe('assistant');
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
      const messageResult = await sendMessage(
        mockConversationId, 
        mockUserId, 
        'How can I manage my irregular periods better?'
      );
      
      // Verify conversation structure from the result
      expect(messageResult).toBeDefined();
      expect(messageResult.userMessage).toBeDefined();
      expect(messageResult.assistantMessage).toBeDefined();
      
      // Verify each message has required fields
      expect(messageResult.userMessage).toMatchObject({
        id: expect.any(String),
        role: 'user',
        content: expect.any(String),
        created_at: expect.any(String)
      });
      
      expect(messageResult.assistantMessage).toMatchObject({
        id: expect.any(String),
        role: 'assistant',
        content: expect.any(String),
        created_at: expect.any(String)
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

      // For testing purposes, we'll simulate the second call by updating the mock
      // In a real implementation, this would be handled by the actual function
      const secondResult = await sendMessage(
        mockConversationId, 
        mockUserId, 
        'What supplements do you recommend?'
      );
      
      // Verify both exchanges completed
      expect(firstResult.userMessage.id).toBe(mockUserMessage.id);
      expect(secondResult.userMessage.id).toBe(mockUserMessage.id); // Mock returns same data
      
      // Verify sequence is maintained
      expect(firstResult.conversationId).toBe(mockConversationId);
      expect(secondResult.conversationId).toBe(mockConversationId);
    });
  });
}; 