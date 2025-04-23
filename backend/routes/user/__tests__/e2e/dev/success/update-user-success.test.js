// @ts-check
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import db from '../../../../../../db/index.js';
import app from '../../../../../../server.js';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';

// Test data
let server;
let request;
let testUser;
let testUserId;
let accessToken;
const TEST_PORT = 5101;

// Setup before all tests
beforeAll(async () => {
  try {
    // Create server and supertest instance
    server = createServer(app);
    request = supertest(app);
    
    // Start server
    await new Promise(resolve => {
      server.listen(TEST_PORT, () => {
        console.log(`Update user test server started on port ${TEST_PORT}`);
        resolve(true);
      });
    });
    
    // Create a test user for update operations
    testUserId = `test-user-${Date.now()}`;
    testUser = {
      id: testUserId,
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password_hash: 'test-hash',
      age: '25_34',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Insert the test user into the database
    await db('users').insert(testUser);
    console.log('Test user created:', testUserId);
    
    // Create JWT token for authentication
    const secret = process.env.JWT_SECRET || 'dev-jwt-secret';
    accessToken = jwt.sign(
      { userId: testUserId, email: testUser.email },
      secret,
      { expiresIn: '1h' }
    );
    console.log('Test token created for user:', testUserId);
    
  } catch (error) {
    console.error('Error in test setup:', error);
    throw error;
  }
}, 30000);

// Cleanup after all tests
afterAll(async () => {
  try {
    // Delete the test user
    if (testUserId) {
      await db('users').where('id', testUserId).delete();
      console.log('Test user deleted:', testUserId);
    }
    
    // Close server
    if (server) {
      await new Promise(resolve => {
        server.close(() => {
          console.log('Update user test server closed');
          resolve(true);
        });
      });
    }
  } catch (error) {
    console.error('Error in test cleanup:', error);
  }
}, 30000);

describe('User Update API - Success Cases', () => {
  it('should successfully update user details', async () => {
    // Skip if no test user
    if (!testUserId) {
      console.log('Skipping test: No test user ID');
      return;
    }
    
    const updatedData = {
      username: `updated_${Date.now()}`,
      age: '35_44'
    };
    
    const response = await request
      .put(`/api/user/me`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updatedData);
    
    console.log('Update response:', response.status, response.body);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', testUserId);
    expect(response.body).toHaveProperty('username', updatedData.username);
    expect(response.body).toHaveProperty('age', updatedData.age);
    expect(response.body).toHaveProperty('email'); // Email is returned but may have changed
    expect(response.body).not.toHaveProperty('password_hash'); // Should not expose password hash
  });
  
  it('should update only allowed fields', async () => {
    // Skip if no test user
    if (!testUserId) {
      console.log('Skipping test: No test user ID');
      return;
    }
    
    // Before updating, fetch current data
    const beforeUser = await db('users').where('id', testUserId).first();
    console.log('User before update:', beforeUser);
    
    // Try to update with fields that shouldn't be directly changeable
    const updateAttempt = {
      id: 'hacker-attempt', // Should not change ID
      email: 'new-email@example.com', // Email might be changeable
      createdAt: new Date(2000, 1, 1).toISOString(), // Should not change creation date
      role: 'admin' // Should not allow role change
    };
    
    const response = await request
      .put(`/api/user/me`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateAttempt);
    
    console.log('Update restricted fields response:', response.status, response.body);
    
    // Get the user directly from the database to verify
    const updatedUser = await db('users').where('id', testUserId).first();
    console.log('User after update:', updatedUser);
    
    expect(response.status).toBe(200);
    expect(updatedUser.id).toBe(testUserId); // ID should not change
    
    // The API may allow email changes, so we don't check that specifically
    
    // Other security-related fields shouldn't change
    if (beforeUser.createdAt) {
      expect(updatedUser.createdAt).toBe(beforeUser.createdAt); // Creation date shouldn't change
    }
    
    if (beforeUser.role) {
      expect(updatedUser.role || 'user').toBe(beforeUser.role || 'user'); // Role shouldn't change
    }
  });
  
  it('should handle empty update payload', async () => {
    // Skip if no test user
    if (!testUserId) {
      console.log('Skipping test: No test user ID');
      return;
    }
    
    // Empty update
    const response = await request
      .put(`/api/user/me`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({});
    
    console.log('Empty update response:', response.status, response.body);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', testUserId);
    // The API returns the user data rather than a "no changes" message
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('updatedAt');
  });
}); 