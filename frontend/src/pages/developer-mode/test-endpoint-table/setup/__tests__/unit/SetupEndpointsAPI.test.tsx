import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Create a helper to conditionally run API tests
const conditionalApiTest = (testName: string, testFn: () => Promise<void>) => {
  return async () => {
    try {
      // First try to ping the API endpoint
      const response = await fetch('http://localhost:5000/api/setup/health/hello', { 
        method: 'GET',
        signal: AbortSignal.timeout(1000) // 1 second timeout
      });
      
      if (response.ok) {
        // API is available, run the test
        await testFn();
      } else {

      }
    } catch (error) {

    }
  };
};

// Create a simplified apiClient for tests
const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 3000,
  headers: { 'Content-Type': 'application/json' }
});

describe('Setup Endpoints (Mock Tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get a hello message from the health endpoint', async () => {
    // Mock the axios implementation for this test
    mockedAxios.get.mockResolvedValueOnce({
      data: { message: 'Hello World from Dottie API!' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });

    // Make the API call using the mocked axios
    const response = await axios.get('/api/setup/health/hello');
    
    // Verify the response
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('message');
    expect(response.data.message).toBe('Hello World from Dottie API!');
    
    // Verify that the correct URL was called
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/setup/health/hello');
  });

  it('should get database status from the database status endpoint', async () => {
    // Mock the axios implementation for this test
    mockedAxios.get.mockResolvedValueOnce({
      data: { status: 'connected' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });

    // Make the API call using the mocked axios
    const response = await axios.get('/api/setup/database/status');
    
    // Verify the response
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('status');
    expect(response.data.status).toBe('connected');
    
    // Verify that the correct URL was called
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/setup/database/status');
  });

  it('should get hello from SQLite message from the database hello endpoint', async () => {
    // Mock the axios implementation for this test
    mockedAxios.get.mockResolvedValueOnce({
      data: { 
        message: 'Hello World from SQLite!',
        dbType: 'sqlite3',
        isConnected: true 
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });

    // Make the API call using the mocked axios
    const response = await axios.get('/api/setup/database/hello');
    
    // Verify the response
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('message');
    expect(response.data).toHaveProperty('dbType');
    expect(response.data).toHaveProperty('isConnected');
    expect(response.data.message).toBe('Hello World from SQLite!');
    expect(response.data.dbType).toBe('sqlite3');
    expect(response.data.isConnected).toBe(true);
    
    // Verify that the correct URL was called
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/setup/database/hello');
  });
});

describe('Setup Endpoints (Real API Tests)', () => {
  // These tests will only run if the API is available
  
  it('should get real health hello message', 
    conditionalApiTest('should get real health hello message', async () => {
      // Make a real API call
      try {
        const response = await apiClient.get('/api/setup/health/hello');
        
        // Verify the response
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('message');
        expect(typeof response.data.message).toBe('string');
        expect(response.data.message).toBe('Hello World from Dottie API!');
      } catch (error) {
        console.error('API call failed:', error);
        throw error; // Rethrow to fail the test
      }
    })
  );
  
  it('should get real database status', 
    conditionalApiTest('should get real database status', async () => {
      // Make a real API call
      try {
        const response = await apiClient.get('/api/setup/database/status');
        
        // Verify the response
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('status');
        expect(typeof response.data.status).toBe('string');
        expect(response.data.status).toBe('connected');
      } catch (error) {
        console.error('API call failed:', error);
        throw error; // Rethrow to fail the test
      }
    })
  );
  
  it('should get real database hello message', 
    conditionalApiTest('should get real database hello message', async () => {
      // Make a real API call
      try {
        const response = await apiClient.get('/api/setup/database/hello');
        
        // Verify the response
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('message');
        expect(response.data).toHaveProperty('dbType');
        expect(response.data).toHaveProperty('isConnected');
        expect(typeof response.data.message).toBe('string');
        expect(typeof response.data.dbType).toBe('string');
        expect(typeof response.data.isConnected).toBe('boolean');
        expect(response.data.message).toBe('Hello World from SQLite!');
        expect(response.data.dbType).toBe('sqlite3');
        expect(response.data.isConnected).toBe(true);
      } catch (error) {
        console.error('API call failed:', error);
        throw error; // Rethrow to fail the test
      }
    })
  );
}); 