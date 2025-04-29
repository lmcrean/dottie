// @ts-check
import { test as base } from '@playwright/test';

// Generate unique test user for this test run
const uniqueId = Date.now();
export const testUser = {
  username: `test_user_${uniqueId}`,
  email: `test_user_${uniqueId}@example.com`,
  password: "SecureTest123!"
};

// Export test with auth data fixture
export const test = base.extend({
  authData: async ({}, use) => {
    // Default auth data with empty tokens
    const authData = {
      testUser,
      userId: null,
      authToken: null,
      refreshToken: null
    };
    
    await use(authData);
  }
});

// Export the expect function from playwright
export { expect } from '@playwright/test'; 