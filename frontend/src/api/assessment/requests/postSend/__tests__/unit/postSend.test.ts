import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { postSend } from '../../Request';
import { apiClient } from '../../../../../core/apiClient';

// Mock the apiClient
vi.mock('../../../../../core/apiClient', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

describe('postSend request', () => {
  const mockAssessmentData = {
    age: '25-plus',
    pattern: 'Regular',
    cycle_length: '28',
    period_duration: '5',
    flow_heaviness: 'Medium',
    pain_level: 'Low',
    physical_symptoms: ['Cramps', 'Bloating'],
    emotional_symptoms: ['Mood swings'],
    recommendations: [
      {
        title: 'Exercise',
        description: 'Regular exercise can help reduce period pain',
      },
    ],
  };

  const mockAssessmentResponse = {
    ...mockAssessmentData,
    id: '123',
    user_id: 'user123',
    created_at: '2023-04-15T12:00:00Z',
    updated_at: '2023-04-15T12:00:00Z'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should send assessment data successfully', async () => {
    // Arrange
    const mockResponse = { data: mockAssessmentResponse };
    (apiClient.post as any).mockResolvedValueOnce(mockResponse);
    
    // Act
    const result = await postSend(mockAssessmentData);
    
    // Assert
    expect(apiClient.post).toHaveBeenCalledTimes(1);
    expect(apiClient.post).toHaveBeenCalledWith('/api/assessment/send', {
      assessmentData: mockAssessmentData
    });
    expect(result).toEqual(mockAssessmentResponse);
    expect(result.id).toBe('123');
  });

  it('should throw an error when the request fails', async () => {
    // Arrange
    const mockError = new Error('Network error');
    (apiClient.post as any).mockRejectedValueOnce(mockError);
    
    // Act & Assert
    await expect(postSend(mockAssessmentData)).rejects.toThrow('Network error');
    expect(apiClient.post).toHaveBeenCalledTimes(1);
    expect(apiClient.post).toHaveBeenCalledWith('/api/assessment/send', {
      assessmentData: mockAssessmentData
    });
  });

  it('should propagate the original error', async () => {
    // Arrange
    const mockError = new Error('API error');
    (apiClient.post as any).mockRejectedValueOnce(mockError);
    
    // Act & Assert
    try {
      await postSend(mockAssessmentData);
      // Force test to fail if no error is thrown
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBe(mockError);
    }
  });
}); 