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
  test('GET /api/setup/database/status - should return database connection status', async ({ request }) => {
    // Send GET request to the database status endpoint
    const response = await request.get('/api/setup/database/status');
    
    // Verify response status is 200 OK
    expect(response.status()).toBe(200);
    
    // Verify response JSON contains status property
    const data = await response.json();
    expect(data).toHaveProperty('status');
    // In a successful test, status should be "connected"
    expect(data.status).toBe('connected');
  });
  
  // Test for /api/setup/database/hello endpoint
  test('GET /api/setup/database/hello - should return database hello message', async ({ request }) => {
    // Send GET request to the database hello endpoint
    const response = await request.get('/api/setup/database/hello');
    
    // Verify response status is 200 OK
    expect(response.status()).toBe(200);
    
    // Verify response JSON contains expected properties
    const data = await response.json();
    expect(data).toHaveProperty('message');
    expect(data).toHaveProperty('dbType');
    expect(data).toHaveProperty('isConnected');
    
    // In a successful test, isConnected should be true
    expect(data.isConnected).toBe(true);
    
    // The message should contain the database type
    expect(data.message).toContain('Hello World from');
  });
}); 