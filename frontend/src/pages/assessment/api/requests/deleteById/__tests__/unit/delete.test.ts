import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { deleteById } from '../../Request';
import { apiClient } from '../../../../../../../api/core/apiClient';
import { getUserData } from '../../../../../../../api/core/tokenManager';

// Mock the apiClient and tokenManager
vi.mock('../../../../../core/apiClient', () => ({
  apiClient: {
    delete: vi.fn(),
  },
}));

vi.mock('../../../../../core/tokenManager', () => ({
  getUserData: vi.fn(),
}));

describe('deleteById request', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock getUserData to return a valid user
    (getUserData as any).mockReturnValue({ id: 'user123' });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should delete assessment by id successfully', async () => {
    // Arrange
    (apiClient.delete as any).mockResolvedValueOnce({});
    
    // Act
    await deleteById('123');
    
    // Assert
    expect(apiClient.delete).toHaveBeenCalledTimes(1);
    expect(apiClient.delete).toHaveBeenCalledWith('/api/assessment/user123/123');
  });

  it('should throw an error when the request fails', async () => {
    // Arrange
    const mockError = new Error('Network error');
    (apiClient.delete as any).mockRejectedValueOnce(mockError);
    
    // Act & Assert
    await expect(deleteById('123')).rejects.toThrow('Network error');
    expect(apiClient.delete).toHaveBeenCalledTimes(1);
    expect(apiClient.delete).toHaveBeenCalledWith('/api/assessment/user123/123');
  });

  it('should throw an error when user data is not available', async () => {
    // Arrange
    (getUserData as any).mockReturnValue(null);
    
    // Act & Assert
    await expect(deleteById('123')).rejects.toThrow('User ID not found');
  });

  it('should propagate the original error', async () => {
    // Arrange
    const mockError = new Error('API error');
    (apiClient.delete as any).mockRejectedValueOnce(mockError);
    
    // Act & Assert
    try {
      await deleteById('123');
      // Force test to fail if no error is thrown
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBe(mockError);
    }
  });
}); 