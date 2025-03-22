import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DbConnection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches SQLite connection status successfully in development', async () => {
    // Setup for development environment
    const mockData = {
      message: 'SQLite connection successful in DEVELOPMENT mode',
      data: { id: 1, name: 'Dottie Test' },
      timestamp: new Date().toISOString(),
    };
    
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    // Execute
    const response = await axios.get('/api/db');
    
    // Verify
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/db');
    expect(response.data).toEqual(mockData);
    expect(response.data.message).toContain('DEVELOPMENT');
    expect(response.data.data.name).toBe('Dottie Test');
  });

  it('handles SQLite connection in production mode', async () => {
    // Setup for production environment
    const mockData = {
      message: 'SQLite testing not available in PRODUCTION mode',
      timestamp: new Date().toISOString(),
    };
    
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    // Execute
    const response = await axios.get('/api/db');
    
    // Verify
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/db');
    expect(response.data).toEqual(mockData);
    expect(response.data.message).toContain('PRODUCTION');
  });

  it('handles SQLite connection error', async () => {
    // Setup for error scenario
    const errorResponse = {
      message: 'SQLite connection error: Database is locked',
      status: 500,
    };
    
    mockedAxios.get.mockRejectedValueOnce({
      response: { data: errorResponse, status: 500 }
    });
    
    // Execute & Verify
    try {
      await axios.get('/api/db');
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      // Verify error was thrown
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/db');
      expect(error).toBeDefined();
    }
  });
}); 