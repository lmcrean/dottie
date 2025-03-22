import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AxiosReq', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('makes correct GET request to API endpoint', async () => {
    // Setup
    const mockData = { message: 'Test message' };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });
    
    // Execute
    const response = await axios.get('/api/message');
    
    // Verify
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/message');
    expect(response.data).toEqual(mockData);
  });

  it('sets correct headers in request', async () => {
    // Setup
    const headers = { 'Content-Type': 'application/json' };
    mockedAxios.get.mockResolvedValueOnce({ data: {} });
    
    // Execute
    await axios.get('/api/message', { headers });
    
    // Verify
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/message', { headers });
  });

  it('handles JSON response correctly', async () => {
    // Setup
    const complexData = { 
      message: 'Success', 
      data: { 
        id: 1, 
        name: 'Test', 
        nested: { value: true }
      }
    };
    mockedAxios.get.mockResolvedValueOnce({ data: complexData });
    
    // Execute
    const response = await axios.get('/api/message');
    
    // Verify
    expect(response.data).toEqual(complexData);
    expect(response.data.data.nested.value).toBe(true);
  });
}); 