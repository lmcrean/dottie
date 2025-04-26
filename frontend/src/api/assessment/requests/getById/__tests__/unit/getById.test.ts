import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getById } from '../../Request';
import { apiClient } from '../../../../../core/apiClient';

// Mock the apiClient
vi.mock('../../../../../core/apiClient', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('getById request', () => {
  const mockAssessment = {
    id: '123',
    user_id: 'user123',
    created_at: '2023-04-15T12:00:00Z',
    updated_at: '2023-04-15T12:00:00Z',
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch assessment by id successfully', async () => {
    // Arrange
    const mockResponse = { data: mockAssessment };
    (apiClient.get as any).mockResolvedValueOnce(mockResponse);
    
    // Act
    const result = await getById('123');
    
    // Assert
    expect(apiClient.get).toHaveBeenCalledTimes(1);
    expect(apiClient.get).toHaveBeenCalledWith('/api/assessment/123');
    expect(result).toEqual(mockAssessment);
  });

  it('should throw an error when the request fails', async () => {
    // Arrange
    const mockError = new Error('Network error');
    (apiClient.get as any).mockRejectedValueOnce(mockError);
    
    // Act & Assert
    await expect(getById('123')).rejects.toThrow('Network error');
    expect(apiClient.get).toHaveBeenCalledTimes(1);
    expect(apiClient.get).toHaveBeenCalledWith('/api/assessment/123');
  });

  it('should propagate the original error', async () => {
    // Arrange
    const mockError = new Error('API error');
    (apiClient.get as any).mockRejectedValueOnce(mockError);
    
    // Act & Assert
    try {
      await getById('123');
      // Force test to fail if no error is thrown
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBe(mockError);
    }
  });
}); 