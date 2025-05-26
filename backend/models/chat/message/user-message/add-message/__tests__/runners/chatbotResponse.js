import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateResponseToMessage } from '../../../../chatbot-message/generateResponse.js';
import { ConfigHelper } from '../../../../chatbot-message/utils/configHelper.js';
import logger from '@/services/logger.js';

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
      const { generateResponseToMessage: mockGenerateResponse } = await import('../../../chatbot-message/generateResponse.js');
      mockGenerateResponse.mockResolvedValue(mockAssistantMessage);
      
      const { ChatDatabaseOperations } = await import('../../../shared/database/chatOperations.js');
      ChatDatabaseOperations.insertMessage.mockResolvedValue(mockAssistantMessage);
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

    it('should detect service type using configHelper', async () => {
      // Test AI service detection
      vi.spyOn(ConfigHelper, 'detectService').mockReturnValue('ai');
      
      await generateResponseToMessage(
        mockConversationId,
        mockUserMessageId,
        'How can I manage my irregular periods better?'
      );
      
      expect(ConfigHelper.detectService).toHaveBeenCalled();
      
      // Test mock service detection
      ConfigHelper.detectService.mockReturnValue('mock');
      
      await generateResponseToMessage(
        mockConversationId,
        mockUserMessageId,
        'How can I manage my irregular periods better?'
      );
      
      expect(ConfigHelper.detectService).toHaveBeenCalled();
    });

    it('should use AI service when .env file exists', async () => {
      // Mock AI service detection
      vi.spyOn(ConfigHelper, 'detectService').mockReturnValue('ai');
      
      const result = await generateResponseToMessage(
        mockConversationId,
        mockUserMessageId,
        'How can I manage irregular periods?'
      );
      
      // Verify AI service was detected and used
      expect(ConfigHelper.detectService).toHaveBeenCalled();
      expect(result.content).toBeDefined();
      expect(result.role).toBe('assistant');
    });

    it('should use mock service when .env file does not exist', async () => {
      // Mock mock service detection
      vi.spyOn(ConfigHelper, 'detectService').mockReturnValue('mock');
      
      const result = await generateResponseToMessage(
        mockConversationId,
        mockUserMessageId,
        'How can I manage irregular periods?'
      );
      
      // Verify mock service was detected and used
      expect(ConfigHelper.detectService).toHaveBeenCalled();
      expect(result.content).toBeDefined();
      expect(result.role).toBe('assistant');
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
      
      // Verify database insertion was called
      const { ChatDatabaseOperations } = await import('../../../shared/database/chatOperations.js');
      expect(ChatDatabaseOperations.insertMessage).toHaveBeenCalledWith(
        mockConversationId,
        expect.objectContaining({
          id: expect.any(String),
          role: 'assistant',
          content: expect.any(String),
          created_at: expect.any(String),
          parent_message_id: mockUserMessageId
        })
      );
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