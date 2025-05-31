import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Test ChatApiService implementation using Axios directly
describe('Chat API Axios Requests', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('POST /api/chat/send', () => {
    it('AxiosReq: successfully sends a message to the AI', async () => {
      const mockResponse = {
        data: {
          message: "I'm here to help with your questions about menstrual health.",
          conversationId: "chat-123456"
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const payload = {
        message: "Can you help me understand my menstrual cycle?",
        conversationId: undefined
      };

      const response = await axios.post('/api/chat/send', payload);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/chat/send', payload);
      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockResponse.data);
    });

    it('AxiosReq: handles errors when sending a message', async () => {
      const errorMessage = 'Network Error';
      mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

      const payload = {
        message: "Can you help me understand my menstrual cycle?",
        conversationId: undefined
      };

      await expect(axios.post('/api/chat/send', payload)).rejects.toThrow(errorMessage);
    });

    it('AxiosReq: includes authentication headers when sending a message', async () => {
      const mockResponse = {
        data: {
          message: "Response to your question",
          conversationId: "chat-123456"
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const payload = {
        message: "Can you help me understand my menstrual cycle?",
        conversationId: undefined
      };

      const headers = {
        headers: {
          Authorization: 'Bearer mock-token'
        }
      };

      const response = await axios.post('/api/chat/send', payload, headers);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/chat/send', payload, headers);
      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockResponse.data);
    });
  });

  describe('GET /api/chat/history', () => {
    it('AxiosReq: successfully fetches conversation history', async () => {
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
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const response = await axios.get('/api/chat/history');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/chat/history');
      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockResponse.data);
    });

    it('AxiosReq: handles errors when fetching conversation history', async () => {
      const errorMessage = 'Network Error';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(axios.get('/api/chat/history')).rejects.toThrow(errorMessage);
    });

    it('AxiosReq: includes authentication headers when fetching history', async () => {
      const mockResponse = {
        data: {
          conversations: []
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const headers = {
        headers: {
          Authorization: 'Bearer mock-token'
        }
      };

      const response = await axios.get('/api/chat/history', headers);

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/chat/history', headers);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/chat/history/:conversationId', () => {
    it('AxiosReq: successfully fetches conversation messages', async () => {
      const conversationId = "conversation-1";
      const mockResponse = {
        data: {
          id: conversationId,
          messages: [
            { role: "user", content: "Hello, can you help with my period symptoms?" },
            { role: "assistant", content: "I'd be happy to help with your period symptoms..." }
          ]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const response = await axios.get(`/api/chat/history/${conversationId}`);

      expect(mockedAxios.get).toHaveBeenCalledWith(`/api/chat/history/${conversationId}`);
      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockResponse.data);
    });

    it('AxiosReq: handles errors when fetching conversation messages', async () => {
      const conversationId = "non-existent-id";
      const errorMessage = 'Request failed with status code 404';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(axios.get(`/api/chat/history/${conversationId}`)).rejects.toThrow(errorMessage);
    });
  });

  describe('DELETE /api/chat/history/:conversationId', () => {
    it('AxiosReq: successfully deletes a conversation', async () => {
      const conversationId = "conversation-to-delete";
      const mockResponse = {
        data: { message: "Conversation deleted" },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      mockedAxios.delete.mockResolvedValueOnce(mockResponse);

      const response = await axios.delete(`/api/chat/history/${conversationId}`);

      expect(mockedAxios.delete).toHaveBeenCalledWith(`/api/chat/history/${conversationId}`);
      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockResponse.data);
    });

    it('AxiosReq: handles errors when deleting a conversation', async () => {
      const conversationId = "invalid-conversation";
      const errorMessage = 'Request failed with status code 403';
      mockedAxios.delete.mockRejectedValueOnce(new Error(errorMessage));

      await expect(axios.delete(`/api/chat/history/${conversationId}`)).rejects.toThrow(errorMessage);
    });

    it('AxiosReq: includes authentication headers when deleting a conversation', async () => {
      const conversationId = "conversation-to-delete";
      const mockResponse = {
        data: { message: "Conversation deleted" },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      mockedAxios.delete.mockResolvedValueOnce(mockResponse);

      const headers = {
        headers: {
          Authorization: 'Bearer mock-token'
        }
      };

      const response = await axios.delete(`/api/chat/history/${conversationId}`, headers);

      expect(mockedAxios.delete).toHaveBeenCalledWith(`/api/chat/history/${conversationId}`, headers);
      expect(response.status).toBe(200);
    });
  });
}); 