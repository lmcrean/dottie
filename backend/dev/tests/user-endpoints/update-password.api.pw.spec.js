import { test, expect } from '@playwright/test';
import { setupUser } from './api-user-setup';

/**
 * Test for POST /api/user/pw/update/:id endpoint
 */
test.describe('User API - Update Password', () => {
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
  
  test('POST /api/user/pw/update/:id - should update user password', async ({ request }) => {
    // Skip this test if no auth token or user ID is available
    test.skip(!authToken || !userId, 'No auth token or user ID available');
    
    // Password update data
    const passwordData = {
      currentPassword: testUser.password,
      newPassword: 'NewPassword456!'
    };
    
    console.log('Updating password for user with ID:', userId);
    
    // Update password
    const response = await request.post(`/api/user/pw/update/${userId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: passwordData
    });
    
    // Log response status for debugging
    console.log('Update password response status:', response.status());
    
    // Verify successful update
    expect(response.status()).toBe(200);
    
    // Verify response contains message
    const data = await response.json();
    expect(data).toHaveProperty('message', 'Password updated successfully');
    expect(data).toHaveProperty('updatedAt');
  });
  
  test('POST /api/user/pw/update/:id - should reject with invalid current password', async ({ request }) => {
    // Skip this test if no auth token or user ID is available
    test.skip(!authToken || !userId, 'No auth token or user ID available');
    
    // Password update data with wrong current password
    const passwordData = {
      currentPassword: 'WrongPassword123!',
      newPassword: 'NewPassword456!'
    };
    
    // Update password
    const response = await request.post(`/api/user/pw/update/${userId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: passwordData
    });
    
    // Verify 401 unauthorized response
    expect(response.status()).toBe(401);
    
    // Verify error message
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Current password is incorrect');
  });
  
  test('POST /api/user/pw/update/:id - should reject with invalid new password format', async ({ request }) => {
    // Skip this test if no auth token or user ID is available
    test.skip(!authToken || !userId, 'No auth token or user ID available');
    
    // Password update data with invalid new password
    const passwordData = {
      currentPassword: testUser.password,
      newPassword: 'weak'
    };
    
    // Update password
    const response = await request.post(`/api/user/pw/update/${userId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: passwordData
    });
    
    // Verify 400 bad request response
    expect(response.status()).toBe(400);
    
    // Verify error message about password requirements
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Password must be at least 8 characters long');
  });
}); 