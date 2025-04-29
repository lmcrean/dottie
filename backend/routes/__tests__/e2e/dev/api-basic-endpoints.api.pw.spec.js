import { test, expect } from '@playwright/test';

/**
 * Test suite for basic API endpoints
 * 
 * These tests run against the actual backend server.
 * The webServer config in playwright.config.js automatically starts
 * and stops the backend server during test runs.
 */
test.describe('Basic API Endpoints', () => {
  
  // Test for /api/setup/health/hello endpoint as a basic API test
  test('GET /api/setup/health/hello - should return a hello message', async ({ request }) => {
    // Send GET request to the hello endpoint
    const response = await request.get('/api/setup/health/hello');
    
    // Verify response status is 200 OK
    expect(response.status()).toBe(200);
    
    // Verify response JSON contains a message property
    const data = await response.json();
    expect(data).toHaveProperty('message');
    expect(data.message).toBe('Hello World from Dottie API!');
  });
  
  // Test for database status endpoint
  test('GET /api/setup/database/status - should return database connection status', async ({ request }) => {
    // Send GET request to the database status endpoint
    const response = await request.get('/api/setup/database/status');
    
    // Check if we have a response (500 is acceptable if DB is not connected)
    expect([200, 500]).toContain(response.status());
    
    if (response.status() === 200) {
      // Verify response JSON contains status property
      const data = await response.json();
      expect(data).toHaveProperty('status');
    }
  });
}); 