import { vi, describe, it, expect, beforeEach } from 'vitest';
import { chatApi } from '../..';
import apiClient from '../../../../../../../api/core/apiClient';

// Correctly mock the API client - both default and named export
vi.mock('../../../core/apiClient', () => {
  const mockClient = {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  };
  return {
    default: mockClient,
    apiClient: mockClient
  };
});

describe('Chat API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('sendMessage', () => {
    it('should send a message to the AI and get a response', async () => {
      const mockMessage = 'Hello, can you help with my period symptoms?';
      const mockResponse = { 
        message: 'I\'d be happy to help with your period symptoms...', 
        conversationId: 'conversation-123' 
      };
      (apiClient.post as any).mockResolvedValueOnce({ data: mockResponse });
      
      const result = await chatApi.sendMessage(mockMessage);
      
      expect(apiClient.post).toHaveBeenCalledWith('/api/chat/send', mockMessage);
      expect(result).toEqual(mockResponse);
    });

    it('should continue a conversation when conversationId is provided', async () => {
      const mockMessage = 'What should I do about cramps?';
      const mockConversationId = 'conversation-123';
      const mockResponse = { 
        message: 'For cramps, you could try...', 
        conversationId: mockConversationId 
      };
      (apiClient.post as any).mockResolvedValueOnce({ data: mockResponse });
      
      const result = await chatApi.sendMessage(mockMessage, mockConversationId);
      
      expect(apiClient.post).toHaveBeenCalledWith('/api/chat/send', mockMessage);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getHistory', () => {
    it('should fetch the chat history for the authenticated user', async () => {
      const mockResponse = { 
        conversations: [
          { 
            id: 'conversation-123', 
            lastMessageDate: '2023-06-15T10:30:00Z',
            preview: 'Hello, can you help with...',
            messages: []
          }
        ] 
      };
      (apiClient.get as any).mockResolvedValueOnce({ data: mockResponse });
      
      const result = await chatApi.getHistory();
      
      expect(apiClient.get).toHaveBeenCalledWith('/api/chat/history');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getConversation', () => {
    it('should fetch a specific conversation by ID', async () => {
      const mockConversationId = 'conversation-123';
      const mockResponse = { 
        id: mockConversationId, 
        messages: [
          { role: 'user', content: 'Hello, can you help with my period symptoms?', timestamp: '2023-06-15T10:30:00Z' },
          { role: 'assistant', content: 'I\'d be happy to help with your period symptoms...', timestamp: '2023-06-15T10:30:05Z' }
        ],
        lastMessageDate: '2023-06-15T10:30:05Z',
        preview: 'Hello, can you help with...'
      };
      (apiClient.get as any).mockResolvedValueOnce({ data: mockResponse });
      
      const result = await chatApi.getConversation(mockConversationId);
      
      expect(apiClient.get).toHaveBeenCalledWith(`/api/chat/history/${mockConversationId}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteConversation', () => {
    it('should delete a specific conversation', async () => {
      const mockConversationId = 'conversation-123';
      (apiClient.delete as any).mockResolvedValueOnce({});
      
      await chatApi.deleteConversation(mockConversationId);
      
      expect(apiClient.delete).toHaveBeenCalledWith(`/api/chat/history/${mockConversationId}`);
    });
  });
}); 