import { test, expect } from '@playwright/test';

/**
 * Test for the user by ID authentication API endpoint
 * 
 * This test runs against the actual backend server.
 * The webServer config in playwright.config.js automatically starts
 * and stops the backend server during test runs.
 */

test.describe('User By ID API Endpoint', () => {
  // Test for /api/auth/users/:id endpoint - GET
  test('GET /api/auth/users/:id - should get user by ID', async ({ request }) => {
    // Skip this test if no auth token or user ID is available
    test.skip(!global.authToken || !global.userId, 'No auth token or user ID available');
    
    // Send request to get specific user
    const response = await request.get(`/api/auth/users/${global.userId}`, {
      headers: {
        'Authorization': `Bearer ${global.authToken}`
      }
    });
    
    // Verify successful response
    expect(response.status()).toBe(200);
    
    // Verify response contains user with matching ID
    const data = await response.json();
    expect(data).toHaveProperty('id', global.userId);
  });
}); 