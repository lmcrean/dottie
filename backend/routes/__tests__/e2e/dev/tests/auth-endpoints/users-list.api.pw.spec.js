import { test, expect } from '@playwright/test';

/**
 * Test for the users list authentication API endpoint
 * 
 * This test runs against the actual backend server.
 * The webServer config in playwright.config.js automatically starts
 * and stops the backend server during test runs.
 */

test.describe('Users List API Endpoint', () => {
  // Test for /api/auth/users endpoint
  test('GET /api/auth/users - should return list of users', async ({ request }) => {
    // Skip this test if no auth token is available
    test.skip(!global.authToken, 'No auth token available');
    
    // Send request to get users with auth token
    const response = await request.get('/api/auth/users', {
      headers: {
        'Authorization': `Bearer ${global.authToken}`
      }
    });
    
    // Verify successful response
    expect(response.status()).toBe(200);
    
    // Verify response contains array of users
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });
}); 