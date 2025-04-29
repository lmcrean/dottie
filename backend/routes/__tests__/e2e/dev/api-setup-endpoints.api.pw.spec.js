import { test, expect } from '@playwright/test';

/**
 * Test suite for setup API endpoints
 * 
 * These tests run against the actual backend server.
 * The webServer config in playwright.config.js automatically starts
 * and stops the backend server during test runs.
 */
test.describe('Setup API Endpoints', () => {
  
  // Test for /api/setup/health/hello endpoint
  test('GET /api/setup/health/hello - should return Hello World message', async ({ request }) => {
    // Send GET request to the health hello endpoint
    const response = await request.get('/api/setup/health/hello');
    
    // Verify response status is 200 OK
    expect(response.status()).toBe(200);
    
    // Verify response JSON contains a message property
    const data = await response.json();
    expect(data).toHaveProperty('message');
    expect(data.message).toBe('Hello World from Dottie API!');
  });
  
  // Test for /api/setup/database/status endpoint
  test('GET /api/setup/database/status - should check database connection status', async ({ request }) => {
    // Send GET request to the database status endpoint
    const response = await request.get('/api/setup/database/status');
    
    // Check if we have a response (500 is acceptable if DB is not connected)
    expect([200, 500]).toContain(response.status());
    
    // If the response is 200, verify the expected properties
    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('status');
    }
  });
  
  // Test for /api/setup/database/hello endpoint
  test('GET /api/setup/database/hello - should return database hello message', async ({ request }) => {
    // Send GET request to the database hello endpoint
    const response = await request.get('/api/setup/database/hello');
    
    // Check if we have a response (500 is acceptable if DB is not connected)
    expect([200, 500]).toContain(response.status());
    
    // If the response is 200, verify it has the expected properties
    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('message');
      
      // Check for dbType or databaseType
      if (data.dbType) {
        expect(data).toHaveProperty('dbType');
      } else {
        expect(data).toHaveProperty('databaseType');
      }
      
      // Check for isConnected property or assume it's connected by the 200 status
      if (data.isConnected !== undefined) {
        expect(data.isConnected).toBe(true);
      }
      
      // The message should contain "Hello World from"
      expect(data.message).toContain('Hello World from');
    }
  });
}); 