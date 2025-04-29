import { test, expect } from '@playwright/test';

/**
 * Common setup and utilities for user API endpoint tests
 */

// Create test user data with unique values
function createTestUser() {
  const timestamp = Date.now();
  return {
    username: `testuser-${timestamp}`,
    email: `test-${timestamp}@example.com`,
    password: 'Password123!'
  };
}

/**
 * Setup function to create a user and get auth token
 */
async function setupUser(request) {
  const testUser = createTestUser();
  let authToken = null;
  let userId = null;
  
  // Create a new user
  const signupResponse = await request.post('/api/auth/signup', {
    data: testUser
  });
  
  if (signupResponse.ok()) {
    const signupData = await signupResponse.json();
    if (signupData.id) {
      userId = signupData.id;
    } else if (signupData.user && signupData.user.id) {
      userId = signupData.user.id;
    }
    
    // Login to get auth token
    const loginResponse = await request.post('/api/auth/login', {
      data: {
        email: testUser.email,
        password: testUser.password
      }
    });
    
    if (loginResponse.ok()) {
      const loginData = await loginResponse.json();
      authToken = loginData.token;
      
      if (loginData.user && loginData.user.id && !userId) {
        userId = loginData.user.id;
      }
    }
  }
  
  return { testUser, authToken, userId };
}

export { createTestUser, setupUser }; 