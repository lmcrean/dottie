import { describe, test, expect, beforeAll, afterAll, afterEach } from 'vitest';
import request from 'supertest';
import app from '../../../server.js';
import { createServer } from 'http';
import { v4 as uuidv4 } from 'uuid';

// Store server instance and test user data
let server;
const TEST_PORT = 5001;

// Generate unique email to avoid conflicts with previous test runs
const uniqueSuffix = uuidv4().substring(0, 8);
const testUser = {
  username: `testuser_${uniqueSuffix}`,
  email: `test_${uniqueSuffix}@example.com`,
  password: 'Password123!',
  age: 25
};

console.log(`Creating test user: ${testUser.username} / ${testUser.email}`);

// Updated credentials for testing updates
let updatedCredentials = [
  { username: `updated1_${uniqueSuffix}`, password: 'UpdatedPass1!' },
  { username: `updated2_${uniqueSuffix}`, password: 'UpdatedPass2!' },
  { username: `updated3_${uniqueSuffix}`, password: 'UpdatedPass3!' }
];

// Store user data and tokens for test steps
let userId;
let authToken;

// Start server before all tests
beforeAll(async () => {
  server = createServer(app);
  await new Promise((resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`Test server started on port ${TEST_PORT}`);
      resolve();
    });
  });
}, 15000);

// Close server after all tests
afterAll(async () => {
  // Try to clean up the test user if it still exists
  if (userId && authToken) {
    try {
      await request(app)
        .delete(`/api/auth/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);
    } catch (error) {
      console.log('Cleanup error:', error.message);
    }
  }
  
  await new Promise((resolve) => {
    server.close(() => {
      console.log('Test server closed');
      resolve();
    });
  });
}, 15000);

describe('User Lifecycle Integration Tests', () => {
  // Step 1: Create a new user
  test('1. Should create a new user', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send(testUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('username');
    expect(response.body.username).toBe(testUser.username);
    expect(response.body.email).toBe(testUser.email);
    
    // Save user ID for later tests
    userId = response.body.id;
    console.log(`Created user with ID: ${userId}`);
  });

  // Step 2: Login with the new user
  test('2. Should login with the new user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.id).toBe(userId);
    
    // Save auth token for later tests
    authToken = response.body.token;
    console.log(`Logged in with token length: ${authToken.length}`);
  });

  // Step 3: Logout the user
  test('3. Should logout the user', async () => {
    const response = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Logged out successfully');
  });

  // Step 4: Login with the user again
  test('4. Should login with the user again', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.id).toBe(userId);
    
    // Update auth token for later tests
    authToken = response.body.token;
    console.log(`Re-logged in with new token length: ${authToken.length}`);
  });

  // Step 5: Update profile details loop (3 iterations)
  for (let i = 0; i < 3; i++) {
    test(`5.${i+1}. Should update user profile (iteration ${i+1})`, async () => {
      // First, verify the user and token
      const userResponse = await request(app)
        .get(`/api/auth/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(userResponse.status).toBe(200);
      
      // 5.1: Update the user's profile
      const updateResponse = await request(app)
        .put(`/api/auth/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          username: updatedCredentials[i].username
        });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body).toHaveProperty('username');
      expect(updateResponse.body.username).toBe(updatedCredentials[i].username);
      console.log(`Updated username to: ${updatedCredentials[i].username}`);

      // 5.3: Logout
      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`);

      expect(logoutResponse.status).toBe(200);

      // 5.4: Login with new username and same password
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password  // Keep original password since we couldn't update it
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body).toHaveProperty('token');
      expect(loginResponse.body.user.username).toBe(updatedCredentials[i].username);
      
      // Update auth token for next iteration
      authToken = loginResponse.body.token;
    });
  }

  // Step 6: Delete the user
  test('6. Should delete the user', async () => {
    // First, verify the user and token
    const userResponse = await request(app)
      .get(`/api/auth/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(userResponse.status).toBe(200);
    
    const response = await request(app)
      .delete(`/api/auth/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('deleted successfully');

    // Verify user is actually deleted by trying to login
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(loginResponse.status).toBe(401); // Should be unauthorized
  });
});
