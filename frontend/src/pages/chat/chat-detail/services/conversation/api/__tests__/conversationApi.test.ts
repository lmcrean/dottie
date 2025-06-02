import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Mock dependencies before importing the module under test
vi.mock('../../../../../../../api/core/apiClient', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    },
    defaults: {
      headers: { common: {} },
      baseURL: 'http://localhost:5000'
    }
  }
}));
vi.mock('axios');

import { conversationApi } from '../conversationApi';
import { apiClient } from '../../../../../../../api/core/apiClient';

const mockApiClient = vi.mocked(apiClient);
const mockAxios = vi.mocked(axios);

describe('conversationApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchConversation', () => {
    it('should fetch conversation successfully', async () => {
      const mockResponse = {
        data: {
          id: 'conv-123',
          messages: [
            { id: 'msg-1', content: 'Hello', role: 'user', created_at: '2024-01-01T10:00:00Z' },
            { id: 'msg-2', content: 'Hi there!', role: 'assistant', created_at: '2024-01-01T10:01:00Z' }
          ],
          assessment_id: 'assess-1'
        }
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await conversationApi.fetchConversation('conv-123');

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/chat/history/conv-123');
      expect(mockApiClient.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse.data);
    });

    it('should return null for 404 errors', async () => {
      const mockError = {
        response: { status: 404 }
      };
      mockAxios.isAxiosError.mockReturnValue(true);
      mockApiClient.get.mockRejectedValue(mockError);

      const result = await conversationApi.fetchConversation('nonexistent-conv');

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/chat/history/nonexistent-conv');
      expect(mockAxios.isAxiosError).toHaveBeenCalledWith(mockError);
      expect(result).toBeNull();
    });

    it('should throw error for non-404 HTTP errors', async () => {
      const mockError = {
        response: { status: 500 }
      };
      mockAxios.isAxiosError.mockReturnValue(true);
      mockApiClient.get.mockRejectedValue(mockError);

      await expect(conversationApi.fetchConversation('conv-123')).rejects.toEqual(mockError);
      expect(mockApiClient.get).toHaveBeenCalledWith('/api/chat/history/conv-123');
    });

    it('should throw error for network errors', async () => {
      const mockError = new Error('Network Error');
      mockAxios.isAxiosError.mockReturnValue(false);
      mockApiClient.get.mockRejectedValue(mockError);

      await expect(conversationApi.fetchConversation('conv-123')).rejects.toThrow('Network Error');
      expect(mockApiClient.get).toHaveBeenCalledWith('/api/chat/history/conv-123');
    });

    it('should convert conversationId to string', async () => {
      const mockResponse = { data: { id: 'conv-123', messages: [] } };
      mockApiClient.get.mockResolvedValue(mockResponse);

      await conversationApi.fetchConversation(123 as any);

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/chat/history/123');
    });

    it('should handle conversation with assessment data', async () => {
      const mockResponse = {
        data: {
          id: 'conv-456',
          messages: [
            { id: 'msg-1', content: 'Assessment complete', role: 'assistant', created_at: '2024-01-01T10:00:00Z' }
          ],
          assessment_id: 'assess-123',
          assessment_object: {
            id: 'assess-123',
            pattern: 'irregular',
            key_findings: ['Long cycle', 'Heavy flow']
          }
        }
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await conversationApi.fetchConversation('conv-456');

      expect(result).toEqual(mockResponse.data);
      expect(result?.assessment_object).toBeDefined();
      expect(result?.assessment_object?.pattern).toBe('irregular');
      expect(result?.assessment_object?.key_findings).toEqual(['Long cycle', 'Heavy flow']);
    });

    it('should handle empty conversation (no messages)', async () => {
      const mockResponse = {
        data: {
          id: 'conv-empty',
          messages: [],
          assessment_id: undefined
        }
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await conversationApi.fetchConversation('conv-empty');

      expect(result).toEqual(mockResponse.data);
      expect(result?.messages).toEqual([]);
      expect(result?.assessment_id).toBeUndefined();
    });

    it('should handle conversation without assessment', async () => {
      const mockResponse = {
        data: {
          id: 'conv-no-assessment',
          messages: [
            { id: 'msg-1', content: 'General chat', role: 'user', created_at: '2024-01-01T10:00:00Z' }
          ]
        }
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await conversationApi.fetchConversation('conv-no-assessment');

      expect(result).toEqual(mockResponse.data);
      expect(result?.assessment_id).toBeUndefined();
      expect(result?.assessment_object).toBeUndefined();
    });

    it('should handle 401 unauthorized errors', async () => {
      const mockError = {
        response: { status: 401 }
      };
      mockAxios.isAxiosError.mockReturnValue(true);
      mockApiClient.get.mockRejectedValue(mockError);

      await expect(conversationApi.fetchConversation('conv-123')).rejects.toEqual(mockError);
    });

    it('should handle 403 forbidden errors', async () => {
      const mockError = {
        response: { status: 403 }
      };
      mockAxios.isAxiosError.mockReturnValue(true);
      mockApiClient.get.mockRejectedValue(mockError);

      await expect(conversationApi.fetchConversation('conv-123')).rejects.toEqual(mockError);
    });

    it('should handle axios errors without response object', async () => {
      const mockError = { message: 'Request failed' };
      mockAxios.isAxiosError.mockReturnValue(true);
      mockApiClient.get.mockRejectedValue(mockError);

      await expect(conversationApi.fetchConversation('conv-123')).rejects.toEqual(mockError);
    });
  });
}); 