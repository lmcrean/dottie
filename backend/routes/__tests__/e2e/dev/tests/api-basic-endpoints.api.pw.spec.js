import { test, expect } from '@playwright/test';

/**
 * Test suite for basic API endpoints
 * 
 * These tests run against the actual backend server.
 * The webServer config in playwright.config.js automatically starts
 * and stops the backend server during test runs.
 */
test.describe('Basic API Endpoints', () => {
  
  // Test for /api/hello endpoint
  test('GET /api/hello - should return a greeting message', async ({ request }) => {
    // Send GET request to the /api/hello endpoint
    const response = await request.get('/api/hello');
    
    // Verify response status is 200 OK
    expect(response.status()).toBe(200);
    
    // Verify response JSON contains a message property
    const data = await response.json();
    expect(data).toHaveProperty('message');
  });
  
  // Test for database status endpoint
  test('GET /api/setup/database/status - should return database connection status', async ({ request }) => {
    // Send GET request to the database status endpoint
    const response = await request.get('/api/setup/database/status');
    
    // Verify response status is 200 OK
    expect(response.status()).toBe(200);
    
    // Verify response JSON contains status property
    const data = await response.json();
    expect(data).toHaveProperty('status');
  });
}); 