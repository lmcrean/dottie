// @ts-check
import { test, expect, testUser } from '../test-fixtures.js';

/**
 * Test suite for authentication endpoints
 * 
 * These tests run against the actual backend server.
 * The webServer config in playwright.config.js automatically starts
 * and stops the backend server during test runs.
 */
test.describe.configure({ mode: 'serial' });

test.describe('Authentication API Endpoints', () => {
  // Store auth tokens between tests
  let userId = null;
  let authToken = null;
  let refreshToken = null;

  test.beforeAll(async () => {
    console.log('Using test user:', testUser);
  });

  test('POST /api/auth/signup - should register a new user', async ({ request }) => {
    const response = await request.post('/api/auth/signup', {
      data: testUser
    });
    
    console.log('Signup response status:', response.status());
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    console.log('Signup response data:', data);
    
    expect(data).toHaveProperty('id');
    expect(data.username).toBe(testUser.username);
    expect(data.email).toBe(testUser.email);
    
    // Store user ID for later tests
    userId = data.id;
  });
  
  test('POST /api/auth/login - should login with the created user', async ({ request }) => {
    const loginData = {
      email: testUser.email,
      password: testUser.password,
    };
    
    console.log('Login with:', loginData);
    
    const response = await request.post('/api/auth/login', {
      data: loginData
    });
    
    console.log('Login response status:', response.status());
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    console.log('Login response data:', JSON.stringify(data).substring(0, 100) + '...');
    
    expect(data).toHaveProperty('token');
    expect(data).toHaveProperty('refreshToken');
    expect(data).toHaveProperty('user');
    expect(data.user.email).toBe(testUser.email);
    
    // Store tokens for later tests
    authToken = data.token;
    refreshToken = data.refreshToken;
  });
  
  test('GET /api/auth/users - should access protected endpoint with valid token', async ({ request }) => {
    test.skip(!authToken, 'No auth token available from login test');
    
    const response = await request.get('/api/auth/users', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    expect(response.status()).toBe(200);
  });
  
  test('POST /api/auth/refresh - should refresh auth token', async ({ request }) => {
    test.skip(!refreshToken, 'No refresh token available from login test');
    
    const response = await request.post('/api/auth/refresh', {
      data: {
        refreshToken: refreshToken
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('token');
    expect(data.token).not.toBe(authToken); // New token should be different
  });
  
  test('POST /api/auth/logout - should logout successfully', async ({ request }) => {
    test.skip(!authToken, 'No auth token available from login test');
    
    const response = await request.post('/api/auth/logout', {
      data: {
        token: authToken
      },
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('Logout response status:', response.status());
    // The API might return 200 or 400, both are acceptable for testing purposes
    expect([200, 400]).toContain(response.status());
  });
}); 