import { test, expect } from '@playwright/test';
import { setupUser } from './api-user-setup';

/**
 * Test for GET /api/auth/users/:id endpoint
 */
test.describe('User API - Get User by ID', () => {
  let authToken = null;
  let userId = null;
  let testUser = null;
  
  // Setup - create user and get auth token
  test.beforeAll(async ({ request }) => {
    const setup = await setupUser(request);
    authToken = setup.authToken;
    userId = setup.userId;
    testUser = setup.testUser;
  });
  
  test('GET /api/auth/users/:id - should return user by ID', async ({ request }) => {
    // Skip this test if no auth token or user ID is available
    test.skip(!authToken || !userId, 'No auth token or user ID available');
    
    // Get specific user
    const response = await request.get(`/api/auth/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    // Verify successful response
    expect(response.status()).toBe(200);
    
    // Verify response contains user data
    const data = await response.json();
    expect(data).toHaveProperty('id', userId);
    expect(data).toHaveProperty('username', testUser.username);
    expect(data).toHaveProperty('email', testUser.email);
    
    // Should not include password hash
    expect(data).not.toHaveProperty('password_hash');
  });
}); 