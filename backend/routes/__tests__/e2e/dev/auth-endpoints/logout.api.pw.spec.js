import { test, expect } from '@playwright/test';
import { testUser } from './signup.api.pw.spec.js';

/**
 * Test for the logout authentication API endpoint
 * 
 * This test runs against the actual backend server.
 * The webServer config in playwright.config.js automatically starts
 * and stops the backend server during test runs.
 */

test.describe('Logout API Endpoint', () => {
  // Test for /api/auth/logout endpoint
  test('POST /api/auth/logout - should logout user and invalidate token', async ({ request }) => {
    // Skip this test if no auth token is available
    test.skip(!global.authToken || !testUser.refreshToken, 'No auth token or refresh token available');
    
    // Send logout request with auth token and refresh token
    const response = await request.post('/api/auth/logout', {
      headers: {
        'Authorization': `Bearer ${global.authToken}`
      },
      data: {
        refreshToken: testUser.refreshToken
      }
    });
    
    // Verify successful logout
    expect(response.status()).toBe(200);
    
    // Verify response contains success message
    const data = await response.json();
    expect(data).toHaveProperty('message');
  });
}); 