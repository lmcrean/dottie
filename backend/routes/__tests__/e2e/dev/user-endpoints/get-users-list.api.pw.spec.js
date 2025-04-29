import { test, expect } from '@playwright/test';
import { setupUser } from './api-user-setup';

/**
 * Test for GET /api/auth/users endpoint
 */
test.describe('User API - Get Users List', () => {
  let authToken = null;
  
  // Setup - create user and get auth token
  test.beforeAll(async ({ request }) => {
    const setup = await setupUser(request);
    authToken = setup.authToken;
  });
  
  test('GET /api/auth/users - should return list of users', async ({ request }) => {
    // Skip this test if no auth token is available
    test.skip(!authToken, 'No auth token available');
    
    // Get all users
    const response = await request.get('/api/auth/users', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    // Verify successful response
    expect(response.status()).toBe(200);
    
    // Verify response is an array
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });
}); 