import { test, expect } from '@playwright/test';

/**
 * Test for the signup authentication API endpoint
 * 
 * This test runs against the actual backend server.
 * The webServer config in playwright.config.js automatically starts
 * and stops the backend server during test runs.
 */

// Shared test user data with unique values to avoid conflicts
const timestamp = Date.now();
const testUser = {
  username: `testuser-${timestamp}`,
  email: `test_user-${timestamp}@example.com`,
  password: 'Password123!'
};

// Export test user for other test files to use
export { testUser };

test.describe('Signup API Endpoint', () => {
  // Test for /api/auth/signup endpoint
  test('POST /api/auth/signup - should register a new user', async ({ request }) => {
    // Send request to register a new user
    const response = await request.post('/api/auth/signup', {
      data: {
        username: testUser.username,
        email: testUser.email,
        password: testUser.password
      }
    });
    
    // Verify successful registration (status code 200 or 201)
    expect(response.status()).toBeLessThan(300);
    
    // Verify response contains expected data
    const data = await response.json();
    
    // The API might return a user object directly instead of a message
    if (data.id) {
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('username', testUser.username);
      expect(data).toHaveProperty('email', testUser.email);
      
      // Export the user ID
      global.userId = data.id;
    } else {
      // Or it might return a message with user data
      expect(data).toHaveProperty('message');
      if (data.user && data.user.id) {
        global.userId = data.user.id;
      }
    }
  });
}); 