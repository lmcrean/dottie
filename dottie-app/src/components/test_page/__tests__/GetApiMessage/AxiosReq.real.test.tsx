import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import axios from 'axios';
import { isApiRunning, conditionalApiTest, apiClient, ensureApiRunning } from './api-test-setup';

describe('AxiosReq (Real API)', () => {
  let apiAvailable = false;

  beforeAll(async () => {
    // Try to ensure API is running before tests
    apiAvailable = await ensureApiRunning();
    if (!apiAvailable) {
      console.log('⚠️ API is not available. Some tests will be skipped.');
    } else {
      console.log('✅ API is available. Running real API tests.');
    }
  });

  beforeEach(() => {
    // No need to clear mocks as we're testing real API calls
  });

  it('makes correct GET request to API endpoint', 
    conditionalApiTest('makes correct GET request to API endpoint', async () => {
      // Make a real API call
      const response = await apiClient.get('/api/hello');
      
      // Assertions will only run if API is available
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
      expect(typeof response.data.message).toBe('string');
    })
  );

  it('sets correct headers in request', 
    conditionalApiTest('sets correct headers in request', async () => {
      // Make a real API call with headers
      const headers = { 'Content-Type': 'application/json' };
      const response = await apiClient.get('/api/hello', { headers });
      
      // Assertions will only run if API is available
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
    })
  );

  it('handles JSON response correctly from real API', 
    conditionalApiTest('handles JSON response correctly from real API', async () => {
      // Make a real API call to sql endpoint
      const response = await apiClient.get('/api/sql-hello');
      
      // Assertions to verify SQL response
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      // The SQL hello endpoint should return specific properties
      expect(response.data).toHaveProperty('message');
      expect(response.data).toHaveProperty('dbType');
      expect(response.data).toHaveProperty('isConnected');
      expect(response.headers['content-type']).toContain('application/json');
    })
  );
}); 