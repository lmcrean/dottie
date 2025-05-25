import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock dependencies before importing the service
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => {
      return {
        getGenerativeModel: vi.fn().mockImplementation(() => {
          return {
            startChat: vi.fn().mockImplementation(() => {
              return {
                sendMessage: vi.fn().mockResolvedValue({
                  response: {
                    text: vi.fn().mockReturnValue('Real Gemini AI response for testing')
                  }
                })
              };
            })
          };
        })
      };
    })
  };
});

vi.mock('../../../../services/logger', () => ({
  default: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn()
  }
}));

vi.mock('../mockResponseService.js', () => ({
  getMockResponse: vi.fn().mockReturnValue('Mock response for testing')
}));

describe('AI Response Service', () => {
  let originalEnv;

  beforeEach(() => {
    // Store original environment
    originalEnv = process.env.GEMINI_API_KEY;
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original environment
    process.env.GEMINI_API_KEY = originalEnv;
    // Clear module cache to reset the service state
    vi.resetModules();
  });

  describe('Mock Mode (No API Key)', () => {
    beforeEach(() => {
      // Remove API key to trigger mock mode
      delete process.env.GEMINI_API_KEY;
      delete process.env.VITE_GEMINI_API_KEY;
    });

    it('should use mock responses when no API key is available', async () => {
      // Dynamic import to get fresh instance with no API key
      const { generateResponse, isInMockMode } = await import('../ai-response/aiResponseService.js');
      const { getMockResponse } = await import('../mock-response/mockResponseService.js');

      const response = await generateResponse('Test message', []);

      expect(isInMockMode()).toBe(true);
      expect(getMockResponse).toHaveBeenCalledWith('Test message');
      expect(response).toBe('Mock response for testing');
    });

    it('should handle initial messages in mock mode', async () => {
      const { generateInitialResponse } = await import('../ai-response/aiResponseService.js');
      const { getMockResponse } = await import('../mock-response/mockResponseService.js');

      const response = await generateInitialResponse('Hello', 'assessment-123');

      expect(getMockResponse).toHaveBeenCalledWith('Hello', 'initial', 'assessment-123');
      expect(response).toBe('Mock response for testing');
    });

    it('should handle follow-up messages in mock mode', async () => {
      const { generateFollowUpResponse } = await import('../ai-response/aiResponseService.js');
      const { getMockResponse } = await import('../mock-response/mockResponseService.js');

      const history = [
        { role: 'user', content: 'Previous message' },
        { role: 'assistant', content: 'Previous response' }
      ];

      const response = await generateFollowUpResponse('Follow up question', history);

      expect(getMockResponse).toHaveBeenCalledWith('Follow up question', 'followup');
      expect(response).toBe('Mock response for testing');
    });
  });

  describe('Real API Mode (With API Key)', () => {
    beforeEach(() => {
      // Set API key to trigger real API mode
      process.env.GEMINI_API_KEY = 'test-api-key';
    });

    it('should use real Gemini API when API key is available', async () => {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const { generateResponse, isInMockMode } = await import('../ai-response/aiResponseService.js');

      const response = await generateResponse('Test message', [], true);

      expect(isInMockMode()).toBe(false);
      expect(GoogleGenerativeAI).toHaveBeenCalledWith('test-api-key');
      expect(response).toBe('Real Gemini AI response for testing');
    });

    it('should fallback to mock response on API error', async () => {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const { getMockResponse } = await import('../mock-response/mockResponseService.js');
      
      // Mock API to throw error
      const mockModel = {
        startChat: vi.fn().mockImplementation(() => {
          return {
            sendMessage: vi.fn().mockRejectedValue(new Error('API Error'))
          };
        })
      };
      GoogleGenerativeAI.mockImplementation(() => ({
        getGenerativeModel: vi.fn().mockReturnValue(mockModel)
      }));

      const { generateResponse } = await import('../ai-response/aiResponseService.js');
      const response = await generateResponse('Test message', []);

      expect(getMockResponse).toHaveBeenCalledWith('Test message');
      expect(response).toBe('Mock response for testing');
    });
  });

  describe('Environment Variable Priority', () => {
    it('should prefer GEMINI_API_KEY over VITE_GEMINI_API_KEY', async () => {
      process.env.GEMINI_API_KEY = 'primary-key';
      process.env.VITE_GEMINI_API_KEY = 'secondary-key';

      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      await import('../ai-response/aiResponseService.js');

      expect(GoogleGenerativeAI).toHaveBeenCalledWith('primary-key');
    });

    it('should use VITE_GEMINI_API_KEY if GEMINI_API_KEY is not available', async () => {
      delete process.env.GEMINI_API_KEY;
      process.env.VITE_GEMINI_API_KEY = 'secondary-key';

      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      await import('../ai-response/aiResponseService.js');

      expect(GoogleGenerativeAI).toHaveBeenCalledWith('secondary-key');
    });
  });
}); 