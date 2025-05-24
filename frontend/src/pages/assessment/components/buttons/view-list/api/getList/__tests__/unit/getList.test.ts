import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getList } from '../../Request';
import { apiClient } from '../../../../../../../../../api/core/apiClient';

// Mock the apiClient
vi.mock('../../../../../core/apiClient', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('getList request', () => {
  const mockAssessments = [
    {
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
    },
    {
      id: '456',
      user_id: 'user123',
      created_at: '2023-05-20T12:00:00Z',
      updated_at: '2023-05-20T12:00:00Z',
      age: '30',
      pattern: 'Irregular',
      cycle_length: '32',
      period_duration: '4',
      flow_heaviness: 'Light',
      pain_level: 'Medium',
      physical_symptoms: ['Headache'],
      emotional_symptoms: ['Irritability'],
      recommendations: [
        {
          title: 'Hydration',
          description: 'Drinking plenty of water can help with headaches',
        },
      ],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch list of assessments successfully', async () => {
    // Arrange
    const mockResponse = { data: mockAssessments };
    (apiClient.get as any).mockResolvedValueOnce(mockResponse);
    
    // Act
    const result = await getList();
    
    // Assert
    expect(apiClient.get).toHaveBeenCalledTimes(1);
    expect(apiClient.get).toHaveBeenCalledWith('/api/assessment/list');
    expect(result).toEqual(mockAssessments);
    expect(result.length).toBe(2);
  });

  it('should throw an error when the request fails', async () => {
    // Arrange
    const mockError = new Error('Network error');
    (apiClient.get as any).mockRejectedValueOnce(mockError);
    
    // Act & Assert
    await expect(getList()).rejects.toThrow('Network error');
    expect(apiClient.get).toHaveBeenCalledTimes(1);
    expect(apiClient.get).toHaveBeenCalledWith('/api/assessment/list');
  });

  it('should propagate the original error', async () => {
    // Arrange
    const mockError = new Error('API error');
    (apiClient.get as any).mockRejectedValueOnce(mockError);
    
    // Act & Assert
    try {
      await getList();
      // Force test to fail if no error is thrown
      expect(true).toBe(false); 
    } catch (error) {
      expect(error).toBe(mockError);
    }
  });
}); 