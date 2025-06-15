import { describe, it, expect, beforeEach, vi } from 'vitest';
import { sendMessage } from '../../sendUserMessage.js';
import logger from '@/services/logger.js';

/**
 * Tests for chatbot response generation (AI or mock based on config)
 */
export const runChatbotResponseTests = (mockData) => {
  const { 
    mockUserId,
    mockConversationId, 
    mockUserMessageId, 
    mockAssistantMessage 
  } = mockData;

  describe('Chatbot response generation', () => {
    beforeEach(() => {
      // Functions are already mocked in the main test file
      // No need to mock them again here
    });

    it('should trigger chatbot response automatically', async () => {
      // Test through the sendMessage flow which includes chatbot response generation
      const result = await sendMessage(
        mockConversationId,
        mockUserId,
        'How can I manage my irregular periods better?'
      );
      
      // Verify response was generated as part of the message flow
      expect(result).toBeDefined();
      expect(result.assistantMessage).toBeDefined();
      expect(result.assistantMessage.id).toBe(mockAssistantMessage.id);
      expect(result.assistantMessage.role).toBe('assistant');
    });

    it('should generate response with correct content', async () => {
      // Test through the sendMessage flow
      const result = await sendMessage(
        mockConversationId,
        mockUserId,
        'How can I manage irregular periods?'
      );
      
      // Verify response has correct structure and content from mock
      expect(result.assistantMessage.content).toBeDefined();
      expect(result.assistantMessage.role).toBe('assistant');
      expect(result.assistantMessage.content).toContain('Based on your irregular period pattern');
    });

    it('should add chatbot response to conversation via conversation_id', async () => {
      // Test through the sendMessage flow
      const result = await sendMessage(
        mockConversationId,
        mockUserId,
        'How can I manage my irregular periods better?'
      );
      
      // Verify response is linked to conversation through the mocked flow
      expect(result.assistantMessage.conversationId).toBe(mockConversationId);
      expect(result.assistantMessage.parent_message_id).toBe(mockUserMessageId);
      
      // Verify structure matches what's expected from the mock
      expect(result.assistantMessage).toMatchObject({
        id: expect.any(String),
        role: 'assistant',
        content: expect.any(String),
        created_at: expect.any(String),
        parent_message_id: mockUserMessageId
      });
    });

    it('should generate contextual response content', async () => {
      // Test through the sendMessage flow
      const result = await sendMessage(
        mockConversationId,
        mockUserId,
        'How can I manage my irregular periods better?'
      );
      
      // Verify response has meaningful content from mock
      expect(result.assistantMessage.content).toBeDefined();
      expect(result.assistantMessage.content.length).toBeGreaterThan(0);
      expect(typeof result.assistantMessage.content).toBe('string');
      
      // Verify response timestamp
      expect(result.assistantMessage.created_at).toBeDefined();
      expect(() => new Date(result.assistantMessage.created_at)).not.toThrow();
    });
  });
}; 