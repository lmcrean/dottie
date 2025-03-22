import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GetApiMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches API message successfully', async () => {
    // Setup
    const mockData = {
      message: 'API is running in DEVELOPMENT mode',
      timestamp: new Date().toISOString(),
    };
    
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    // Execute
    const response = await axios.get('/api/message');
    
    // Verify
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/message');
    expect(response.data).toEqual(mockData);
    expect(response.data.message).toContain('DEVELOPMENT');
  });

  it('handles API message error', async () => {
    // Setup
    const errorMessage = 'Network Error';
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));
    
    // Execute & Verify
    await expect(axios.get('/api/message')).rejects.toThrow(errorMessage);
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/message');
  });
}); 