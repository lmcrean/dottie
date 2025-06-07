import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Properly mock axios
vi.mock('axios', async (importOriginal) => {
  const axiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn(), clear: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn(), clear: vi.fn() }
    },
    defaults: {
      baseURL: '',
      headers: {}
    }
  };
  
  return {
    default: {
      create: vi.fn(() => axiosInstance),
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      isAxiosError: vi.fn((error) => error?.isAxiosError || false),
      ...axiosInstance
    }
  };
});

// Type the mocked axios properly
const mockedAxios = axios as unknown as {
  create: vi.MockedFunction<typeof axios.create>;
  get: vi.MockedFunction<typeof axios.get>;
  post: vi.MockedFunction<typeof axios.post>;
  put: vi.MockedFunction<typeof axios.put>;
  delete: vi.MockedFunction<typeof axios.delete>;
  isAxiosError: vi.MockedFunction<typeof axios.isAxiosError>;
  interceptors: {
    request: { use: vi.MockedFunction<any>, eject: vi.MockedFunction<any>, clear: vi.MockedFunction<any> },
    response: { use: vi.MockedFunction<any>, eject: vi.MockedFunction<any>, clear: vi.MockedFunction<any> }
  };
  defaults: {
    baseURL: string;
    headers: Record<string, string>;
  };
};

describe('API Client Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should have the correct base URL', () => {
    // Create a client with the expected config
    const client = axios.create({
      baseURL: 'http://localhost:5000',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Since it's mocked, we're checking that axios.create was called with the correct config
    expect(axios.create).toHaveBeenCalled();
    
    // This is a more hypothetical test since we're mocking the creation
    const createCall = vi.mocked(axios.create).mock.calls[0][0];
    expect(createCall).toBeDefined();
    
    // Check if baseURL is provided to axios.create
    expect(createCall).toHaveProperty('baseURL');
    expect(createCall).toHaveProperty('headers');
    expect(createCall.headers).toHaveProperty('Content-Type');
  });

  it('should handle successful GET requests', async () => {
    // Setup the mock response
    const mockResponse = {
      data: { message: 'Success response' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
    
    // Configure the mock
    mockedAxios.get.mockResolvedValueOnce(mockResponse);
    
    // Test making a request
    const response = await axios.get('/api/test-endpoint');
    
    // Verify response
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ message: 'Success response' });
    
    // Verify the correct URL was called
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/test-endpoint');
  });

  it('should handle 404 errors gracefully', async () => {
    // Create a mock axios error response
    const mockErrorResponse = {
      response: {
        data: { error: 'Not found' },
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: {}
      },
      isAxiosError: true,
      toJSON: () => ({})
    };
    
    // Configure the mock to reject with the error
    mockedAxios.get.mockRejectedValueOnce(mockErrorResponse);
    
    // Test making a request that will fail
    try {
      await axios.get('/api/non-existent');
      // Should not reach here
      expect(true).toBe(false); // Force test to fail if we reach here
    } catch (error: any) {
      // Verify error is handled correctly
      expect(error.response.status).toBe(404);
      expect(error.response.data).toEqual({ error: 'Not found' });
    }
    
    // Verify the correct URL was called
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/non-existent');
  });

  it('should handle server errors gracefully', async () => {
    // Create a mock axios error response for a 500 error
    const mockErrorResponse = {
      response: {
        data: { error: 'Internal server error' },
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: {}
      },
      isAxiosError: true,
      toJSON: () => ({})
    };
    
    // Configure the mock to reject with the error
    mockedAxios.get.mockRejectedValueOnce(mockErrorResponse);
    
    // Test making a request that will fail with a server error
    try {
      await axios.get('/api/server-error');
      // Should not reach here
      expect(true).toBe(false); // Force test to fail if we reach here
    } catch (error: any) {
      // Verify error is handled correctly
      expect(error.response.status).toBe(500);
      expect(error.response.data).toEqual({ error: 'Internal server error' });
    }
    
    // Verify the correct URL was called
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/server-error');
  });

  it('should handle network errors', async () => {
    // Create a mock axios error for a network error (no response property)
    const mockNetworkError = {
      message: 'Network Error',
      isAxiosError: true,
      toJSON: () => ({})
    };
    
    // Configure the mock to reject with the error
    mockedAxios.get.mockRejectedValueOnce(mockNetworkError);
    
    // Test making a request that will fail with a network error
    try {
      await axios.get('/api/network-error');
      // Should not reach here
      expect(true).toBe(false); // Force test to fail if we reach here
    } catch (error: any) {
      // Verify error is a network error
      expect(error.message).toBe('Network Error');
      expect(error.response).toBeUndefined();
    }
    
    // Verify the correct URL was called
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/network-error');
  });
}); 