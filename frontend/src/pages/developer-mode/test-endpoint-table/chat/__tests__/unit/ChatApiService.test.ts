import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import axios from 'axios';
import { ChatApiService } from '../../services/ChatApiService';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ChatApiService', () => {
  let service: ChatApiService;
  
  // Mock console.error to avoid cluttering the test output
  const originalConsoleError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  
  afterAll(() => {
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    service = new ChatApiService();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('sendMessage', () => {
    it('sends a message to the API with the correct payload', async () => {
      const mockResponse = { 
        data: { 
          message: "AI response message", 
          conversationId: "new-conversation-id" 
        }
      };
      
      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      
      const result = await service.sendMessage("Hello, how can you help with my period symptoms?");
      
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/chat/send', {
        message: "Hello, how can you help with my period symptoms?",
        conversationId: undefined
      });
      
      expect(result).toEqual(mockResponse.data);
    });
    
    it('includes conversationId when provided', async () => {
      const mockResponse = { 
        data: { 
          message: "AI follow-up response", 
          conversationId: "existing-conversation-id" 
        }
      };
      
      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      
      const result = await service.sendMessage(
        "Can you tell me more about managing cramps?", 
        "existing-conversation-id"
      );
      
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/chat/send', {
        message: "Can you tell me more about managing cramps?",
        conversationId: "existing-conversation-id"
      });
      
      expect(result).toEqual(mockResponse.data);
    });
    
    it('handles errors when sending a message', async () => {
      const errorMessage = 'Network Error';
      mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(service.sendMessage('Test message')).rejects.toThrow(errorMessage);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getConversationHistory', () => {
    it('fetches conversation history from the API', async () => {
      const mockResponse = {
        data: {
          conversations: [
            { 
              id: "conversation-1", 
              lastMessageDate: "2023-06-15T10:30:00Z", 
              preview: "Hello, can you help with..." 
            },
            { 
              id: "conversation-2", 
              lastMessageDate: "2023-06-16T14:20:00Z", 
              preview: "I'm having trouble with..." 
            }
          ]
        }
      };
      
      mockedAxios.get.mockResolvedValueOnce(mockResponse);
      
      const result = await service.getConversationHistory();
      
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/chat/history');
      expect(result).toEqual(mockResponse.data);
    });
    
    it('handles errors when fetching conversation history', async () => {
      const errorMessage = 'Network Error';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(service.getConversationHistory()).rejects.toThrow(errorMessage);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getConversationMessages', () => {
    it('fetches messages for a specific conversation', async () => {
      const conversationId = "conversation-1";
      const mockResponse = {
        data: {
          id: conversationId,
          messages: [
            { role: "user", content: "Hello, can you help with my period symptoms?" },
            { role: "assistant", content: "I'd be happy to help with your period symptoms..." }
          ]
        }
      };
      
      mockedAxios.get.mockResolvedValueOnce(mockResponse);
      
      const result = await service.getConversationMessages(conversationId);
      
      expect(mockedAxios.get).toHaveBeenCalledWith(`/api/chat/history/${conversationId}`);
      expect(result).toEqual(mockResponse.data);
    });
    
    it('handles errors when fetching conversation messages', async () => {
      const conversationId = 'conversation-1';
      const errorMessage = 'Network Error';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(service.getConversationMessages(conversationId)).rejects.toThrow(errorMessage);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('deleteConversation', () => {
    it('deletes a conversation', async () => {
      const conversationId = "conversation-to-delete";
      const mockResponse = {
        data: { message: "Conversation deleted" }
      };
      
      mockedAxios.delete.mockResolvedValueOnce(mockResponse);
      
      const result = await service.deleteConversation(conversationId);
      
      expect(mockedAxios.delete).toHaveBeenCalledWith(`/api/chat/history/${conversationId}`);
      expect(result).toEqual(mockResponse.data);
    });
    
    it('handles errors when deleting a conversation', async () => {
      const conversationId = 'conversation-to-delete';
      const errorMessage = 'Network Error';
      mockedAxios.delete.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(service.deleteConversation(conversationId)).rejects.toThrow(errorMessage);
      expect(console.error).toHaveBeenCalled();
    });
  });
}); 