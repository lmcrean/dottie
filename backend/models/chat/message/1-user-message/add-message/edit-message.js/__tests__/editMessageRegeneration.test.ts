import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock dependencies first
vi.mock('../cleanupChildrenMessages.js');
vi.mock('../../../../2-chatbot-message/generateResponse.js');
vi.mock('../../database/sendUserMessage.js');
vi.mock('../../../../../list/chat.js');
vi.mock('@/services/logger.js');
vi.mock('@/services/dbService.js', () => ({
  default: {
    create: vi.fn().mockResolvedValue({}),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}));

import { editMessage, editMessageWithRegeneration } from '../editMessageRegeneration.js';
import { cleanupChildrenMessages } from '../cleanupChildrenMessages.js';
import { generateResponseToMessage, generateAndSaveResponse } from '../../../../2-chatbot-message/generateResponse.js';
import { updateChatMessage } from '../../database/sendUserMessage.js';
import Chat from '../../../../../list/chat.js';
import logger from '@/services/logger.js';

describe('Edit Message and Regeneration', () => {
  const mockUserId = 'test-user-123';
  const mockConversationId = 'test-conversation-456';
  const mockMessageId = 'test-message-789';
  const mockNewContent = 'This is the updated message content';
  
  const mockUpdatedMessage = {
    id: mockMessageId,
    conversation_id: mockConversationId,
    role: 'user',
    content: mockNewContent,
    edited_at: '2024-01-15T10:00:00.000Z',
    created_at: '2024-01-15T09:00:00.000Z'
  };

  const mockNewResponse = {
    id: 'response-123',
    conversation_id: mockConversationId,
    role: 'assistant',
    content: 'Thank you for clarifying. Based on your updated message...',
    created_at: '2024-01-15T10:01:00.000Z'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    logger.info = vi.fn();
    logger.error = vi.fn();
    
    // Setup default successful mocks
    Chat.isOwner.mockResolvedValue(true);
    updateChatMessage.mockResolvedValue(mockUpdatedMessage);
    cleanupChildrenMessages.mockResolvedValue(['msg-old-1', 'msg-old-2']);
    
    // Explicitly set up the generateResponseToMessage mock
    generateResponseToMessage.mockClear();
    generateResponseToMessage.mockResolvedValue(mockNewResponse);
    
    generateAndSaveResponse.mockResolvedValue(mockNewResponse);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('editMessage', () => {
    it('should successfully edit a message when user owns conversation', async () => {
      const result = await editMessage(mockConversationId, mockMessageId, mockUserId, mockNewContent);
      
      expect(Chat.isOwner).toHaveBeenCalledWith(mockConversationId, mockUserId);
      expect(updateChatMessage).toHaveBeenCalledWith(
        mockConversationId, 
        mockMessageId, 
        expect.objectContaining({
          content: mockNewContent,
          edited_at: expect.any(String)
        })
      );
      expect(result).toEqual(mockUpdatedMessage);
      expect(logger.info).toHaveBeenCalledWith(`Message ${mockMessageId} edited in conversation ${mockConversationId}`);
    });

    it('should throw error when user does not own conversation', async () => {
      Chat.isOwner.mockResolvedValue(false);
      
      await expect(editMessage(mockConversationId, mockMessageId, mockUserId, mockNewContent))
        .rejects.toThrow('User does not own this conversation');
      
      expect(updateChatMessage).not.toHaveBeenCalled();
    });

    it('should handle database update errors', async () => {
      const dbError = new Error('Database update failed');
      updateChatMessage.mockRejectedValue(dbError);
      
      await expect(editMessage(mockConversationId, mockMessageId, mockUserId, mockNewContent))
        .rejects.toThrow('Database update failed');
      
      expect(logger.error).toHaveBeenCalledWith('Error editing message:', dbError);
    });
  });

  describe('editMessageWithRegeneration', () => {
    it('should complete full edit and regeneration flow successfully', async () => {
      const result = await editMessageWithRegeneration(
        mockConversationId, 
        mockMessageId, 
        mockUserId, 
        mockNewContent
      );
      
      // Verify cleanup was called first
      expect(cleanupChildrenMessages).toHaveBeenCalledWith(mockConversationId, mockMessageId);
      
      // Verify message was edited
      expect(updateChatMessage).toHaveBeenCalledWith(
        mockConversationId, 
        mockMessageId, 
        expect.objectContaining({
          content: mockNewContent,
          edited_at: expect.any(String)
        })
      );
      
      // Verify response was regenerated
      expect(generateResponseToMessage).toHaveBeenCalledWith(
        mockConversationId,
        mockUserId,
        mockMessageId,
        mockNewContent
      );
      
      expect(result).toEqual({
        updatedMessage: mockUpdatedMessage,
        newResponse: mockNewResponse,
        deletedMessageIds: ['msg-old-1', 'msg-old-2'],
        conversationId: mockConversationId,
        timestamp: expect.any(String)
      });
    });

    it('should skip regeneration when regenerateResponse is false', async () => {
      const result = await editMessageWithRegeneration(
        mockConversationId, 
        mockMessageId, 
        mockUserId, 
        mockNewContent,
        { regenerateResponse: false }
      );
      
      expect(cleanupChildrenMessages).toHaveBeenCalled();
      expect(updateChatMessage).toHaveBeenCalled();
      expect(generateResponseToMessage).not.toHaveBeenCalled();
      
      expect(result.newResponse).toBeNull();
      expect(result.updatedMessage).toEqual(mockUpdatedMessage);
    });

    it('should handle cleanup errors gracefully', async () => {
      const cleanupError = new Error('Cleanup failed');
      cleanupChildrenMessages.mockRejectedValue(cleanupError);
      
      await expect(editMessageWithRegeneration(
        mockConversationId, 
        mockMessageId, 
        mockUserId, 
        mockNewContent
      )).rejects.toThrow('Cleanup failed');
      
      expect(logger.error).toHaveBeenCalledWith('Error in message edit flow:', cleanupError);
    });

    it('should handle regeneration errors gracefully', async () => {
      const regenerationError = new Error('Response generation failed');
      generateResponseToMessage.mockClear();
      generateResponseToMessage.mockRejectedValue(regenerationError);
      
      await expect(editMessageWithRegeneration(
        mockConversationId, 
        mockMessageId, 
        mockUserId, 
        mockNewContent
      )).rejects.toThrow('Response generation failed');
      
      expect(cleanupChildrenMessages).toHaveBeenCalled();
      expect(updateChatMessage).toHaveBeenCalled();
    });

    it('should handle authorization failures during edit flow', async () => {
      Chat.isOwner.mockResolvedValue(false);
      
      await expect(editMessageWithRegeneration(
        mockConversationId, 
        mockMessageId, 
        mockUserId, 
        mockNewContent
      )).rejects.toThrow('User does not own this conversation');
      
      // Cleanup should still happen before authorization check
      expect(cleanupChildrenMessages).toHaveBeenCalled();
      expect(generateResponseToMessage).not.toHaveBeenCalled();
    });
  });

  describe('Message Content Updates', () => {
    it('should preserve original message metadata while updating content', async () => {
      const result = await editMessage(mockConversationId, mockMessageId, mockUserId, mockNewContent);
      
      expect(result.id).toBe(mockMessageId);
      expect(result.conversation_id).toBe(mockConversationId);
      expect(result.role).toBe('user');
      expect(result.content).toBe(mockNewContent);
      expect(result.edited_at).toBeDefined();
      expect(result.created_at).toBe('2024-01-15T09:00:00.000Z');
    });

    it('should handle empty or whitespace content appropriately', async () => {
      const emptyContent = '   ';
      
      await editMessage(mockConversationId, mockMessageId, mockUserId, emptyContent);
      
      expect(updateChatMessage).toHaveBeenCalledWith(
        mockConversationId, 
        mockMessageId, 
        expect.objectContaining({
          content: emptyContent,
          edited_at: expect.any(String)
        })
      );
    });
  });

  describe('Logging and Monitoring', () => {
    it('should log successful edit operations', async () => {
      await editMessage(mockConversationId, mockMessageId, mockUserId, mockNewContent);
      
      expect(logger.info).toHaveBeenCalledWith(
        `Message ${mockMessageId} edited in conversation ${mockConversationId}`
      );
    });

    it('should log edit flow start and completion', async () => {
      await editMessageWithRegeneration(mockConversationId, mockMessageId, mockUserId, mockNewContent);
      
      expect(logger.info).toHaveBeenCalledWith(`Starting message edit flow for message ${mockMessageId}`);
      expect(logger.info).toHaveBeenCalledWith(`Message edit flow completed for message ${mockMessageId}`);
    });
  });
}); 