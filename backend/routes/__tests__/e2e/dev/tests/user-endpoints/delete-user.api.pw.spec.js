import { test, expect } from '@playwright/test';
import { setupUser } from './api-user-setup';

/**
 * Test for DELETE /api/auth/users/:id endpoint
 * This test is skipped by default because it would remove the test user,
 * which might be needed for subsequent tests.
 */
test.describe('User API - Delete User', () => {
  let authToken = null;
  let userId = null;
  
  // Setup - create user and get auth token
  test.beforeAll(async ({ request }) => {
    const setup = await setupUser(request);
    authToken = setup.authToken;
    userId = setup.userId;
  });
  
  test.skip('DELETE /api/auth/users/:id - should delete user', async ({ request }) => {
    // Skip this test if no auth token or user ID is available
    test.skip(!authToken || !userId, 'No auth token or user ID available');
    
    // Delete user
    const response = await request.delete(`/api/auth/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    // Verify successful deletion
    expect(response.status()).toBe(200);
    
    // Verify response contains success message
    const data = await response.json();
    expect(data).toHaveProperty('message');
    
    // Try to get the deleted user - should return 404
    const getResponse = await request.get(`/api/auth/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    expect(getResponse.status()).toBe(404);
  });
}); 