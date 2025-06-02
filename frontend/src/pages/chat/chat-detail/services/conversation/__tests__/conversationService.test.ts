import { describe, it, expect, vi, beforeEach } from 'vitest';
import { conversationService } from '../conversationService';
import { conversationApi } from '../api';

// Mock the API layer
vi.mock('../api', () => ({
  conversationApi: {
    fetchConversation: vi.fn()
  }
}));

const mockConversationApi = vi.mocked(conversationApi);

describe('conversationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchConversation', () => {
    it('should call conversationApi.fetchConversation with correct parameters', async () => {
      const mockResponse = {
        id: 'conv-123',
        messages: [
          { id: 'msg-1', content: 'Hello', role: 'user', created_at: '2024-01-01T10:00:00Z' }
        ],
        assessment_id: 'assess-1'
      };
      mockConversationApi.fetchConversation.mockResolvedValue(mockResponse);

      const result = await conversationService.fetchConversation('conv-123');

      expect(mockConversationApi.fetchConversation).toHaveBeenCalledWith('conv-123');
      expect(mockConversationApi.fetchConversation).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });

    it('should return null when API returns null (404 case)', async () => {
      mockConversationApi.fetchConversation.mockResolvedValue(null);

      const result = await conversationService.fetchConversation('nonexistent-conv');

      expect(mockConversationApi.fetchConversation).toHaveBeenCalledWith('nonexistent-conv');
      expect(result).toBeNull();
    });

    it('should handle API errors gracefully by propagating them', async () => {
      const mockError = new Error('Network connection failed');
      mockConversationApi.fetchConversation.mockRejectedValue(mockError);

      await expect(conversationService.fetchConversation('conv-123')).rejects.toThrow('Network connection failed');
      expect(mockConversationApi.fetchConversation).toHaveBeenCalledWith('conv-123');
    });

    it('should handle authentication errors', async () => {
      const authError = new Error('Unauthorized');
      mockConversationApi.fetchConversation.mockRejectedValue(authError);

      await expect(conversationService.fetchConversation('conv-123')).rejects.toThrow('Unauthorized');
    });

    it('should pass through conversation with assessment data', async () => {
      const mockResponseWithAssessment = {
        id: 'conv-456',
        messages: [
          { id: 'msg-1', content: 'Hello', role: 'user', created_at: '2024-01-01T10:00:00Z' },
          { id: 'msg-2', content: 'Hi there!', role: 'assistant', created_at: '2024-01-01T10:01:00Z' }
        ],
        assessment_id: 'assess-123',
        assessment_object: {
          id: 'assess-123',
          pattern: 'regular',
          key_findings: ['Normal cycle length', 'Healthy flow']
        }
      };
      mockConversationApi.fetchConversation.mockResolvedValue(mockResponseWithAssessment);

      const result = await conversationService.fetchConversation('conv-456');

      expect(result).toEqual(mockResponseWithAssessment);
      expect(result?.assessment_object).toBeDefined();
      expect(result?.assessment_object?.pattern).toBe('regular');
    });

    it('should handle empty message arrays', async () => {
      const mockEmptyConversation = {
        id: 'conv-empty',
        messages: [],
        assessment_id: undefined
      };
      mockConversationApi.fetchConversation.mockResolvedValue(mockEmptyConversation);

      const result = await conversationService.fetchConversation('conv-empty');

      expect(result).toEqual(mockEmptyConversation);
      expect(result?.messages).toEqual([]);
    });

    it('should handle numeric conversationId by passing to API as-is', async () => {
      const mockResponse = { id: 'conv-999', messages: [] };
      mockConversationApi.fetchConversation.mockResolvedValue(mockResponse);

      // API layer handles string conversion, service just passes through
      await conversationService.fetchConversation('999');

      expect(mockConversationApi.fetchConversation).toHaveBeenCalledWith('999');
    });
  });
}); 