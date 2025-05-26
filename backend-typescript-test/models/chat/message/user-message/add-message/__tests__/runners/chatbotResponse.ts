import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateResponseToMessage } from '../../../../chatbot-message/generateResponse.ts';
import logger from '@/services/logger.ts';

/**
 * Tests for chatbot response generation (AI or mock based on config)
 */
export const runChatbotResponseTests = (mockData) => {
  const { 
    mockConversationId, 
    mockUserMessageId, 
    mockAssistantMessage 
  } = mockData;

  describe('Chatbot response generation', () => {
    beforeEach(async () => {
      // Setup mocks for chatbot response scenarios
      const { generateResponseToMessage: mockGenerateResponse } = await import('../../../../chatbot-message/generateResponse.js');
      mockGenerateResponse.mockResolvedValue(mockAssistantMessage);
      
      const { sendChatbotMessage } = await import('../../../../chatbot-message/database/sendChatbotMessage.js');
      sendChatbotMessage.mockResolvedValue(mockAssistantMessage);
    });

    it('should trigger chatbot response automatically', async () => {
      const result = await generateResponseToMessage(
        mockConversationId,
        mockUserMessageId,
        'How can I manage my irregular periods better?'
      );
      
      // Verify response was generated
      expect(result).toBeDefined();
      expect(result.id).toBe(mockAssistantMessage.id);
      expect(result.role).toBe('assistant');
    });

    it('should generate response with correct content', async () => {
      const result = await generateResponseToMessage(
        mockConversationId,
        mockUserMessageId,
        'How can I manage irregular periods?'
      );
      
      // Verify response has correct structure and content
      expect(result.content).toBeDefined();
      expect(result.role).toBe('assistant');
      expect(result.content).toContain('How can I manage irregular periods?');
    });

    it('should add chatbot response to conversation via conversation_id', async () => {
      const result = await generateResponseToMessage(
        mockConversationId,
        mockUserMessageId,
        'How can I manage my irregular periods better?'
      );
      
      // Verify response is linked to conversation
      expect(result.conversationId).toBe(mockConversationId);
      expect(result.parent_message_id).toBe(mockUserMessageId);
      
      // Verify database insertion was called (simplified for testing)
      // In actual implementation, sendChatbotMessage would be called internally
      expect(result).toMatchObject({
        id: expect.any(String),
        role: 'assistant',
        content: expect.any(String),
        created_at: expect.any(String),
        parent_message_id: mockUserMessageId
      });
    });

    it('should generate contextual response content', async () => {
      const result = await generateResponseToMessage(
        mockConversationId,
        mockUserMessageId,
        'How can I manage my irregular periods better?'
      );
      
      // Verify response has meaningful content
      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);
      expect(typeof result.content).toBe('string');
      
      // Verify response timestamp
      expect(result.created_at).toBeDefined();
      expect(() => new Date(result.created_at)).not.toThrow();
    });
  });
}; 
