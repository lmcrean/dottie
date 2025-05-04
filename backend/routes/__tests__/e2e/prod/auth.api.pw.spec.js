// @ts-check
import { test, expect } from '@playwright/test';

// Target production backend
const baseUrl = 'http://dottie-backend.vercel.app';

test.describe('Authentication Endpoints Tests', () => {
  // Generate unique test user for this test run
  const uniqueId = Date.now();
  const testUser = {
    username: `test_user_${uniqueId}`,
    email: `test_user_${uniqueId}@example.com`,
    password: "SecureTest123!",
  };

  let authToken = null;
  let refreshToken = null;
  
  test('should register a new user', async ({ request }) => {
    const response = await request.post(`${baseUrl}/api/auth/signup`, {
      data: testUser
    });
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.username).toBe(testUser.username);
    expect(data.email).toBe(testUser.email);
  });
  
  test('should login with the newly created user', async ({ request }) => {
    const response = await request.post(`${baseUrl}/api/auth/login`, {
      data: {
        email: testUser.email,
        password: testUser.password,
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('token');
    expect(data).toHaveProperty('refreshToken');
    expect(data).toHaveProperty('user');
    expect(data.user.email).toBe(testUser.email);
    
    // Store tokens for later tests
    authToken = data.token;
    test.setTimeout(120000); // Extend timeout for token-dependent tests
  });
  
  test('should refresh the auth token', async ({ request }) => {
    // Skip if login test failed (no refreshToken)
    test.skip(!authToken, 'No auth token available from login test');
    
    const response = await request.post(`${baseUrl}/api/auth/refresh`, {
      data: {
        refreshToken: refreshToken,
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('token');
    expect(data.token).not.toBe(authToken);
  });
  
  test('should log out the user', async ({ request }) => {
    // Skip if login test failed (no authToken)
    test.skip(!authToken, 'No auth token available from login test');
    
    const response = await request.post(`${baseUrl}/api/auth/logout`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    expect(response.status()).toBe(200);
  });
}); 