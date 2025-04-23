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
let testUsers = [];
let accessTokens = {};
const TEST_PORT = 5104;

// Setup before all tests
beforeAll(async () => {
  try {
    // Create server and supertest instance
    server = createServer(app);
    request = supertest(app);
    
    // Start server
    await new Promise(resolve => {
      server.listen(TEST_PORT, () => {
        console.log(`Delete user test server started on port ${TEST_PORT}`);
        resolve(true);
      });
    });
    
    // Create test users
    const timestamp = Date.now();
    
    // User 1 for deletion by self
    const deleteUser = {
      id: `delete-user-${timestamp}`,
      username: `deleteuser_${timestamp}`,
      email: `delete_${timestamp}@example.com`,
      password_hash: 'test-hash-1',
      age: '18_24',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // User 2 - For testing access control
    const targetUser = {
      id: `target-user-${timestamp}`,
      username: `targetuser_${timestamp}`,
      email: `target_${timestamp}@example.com`,
      password_hash: 'test-hash-2',
      age: '25_34',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Insert test users
    await db('users').insert(deleteUser);
    await db('users').insert(targetUser);
    
    // Store test users for cleanup
    testUsers.push(deleteUser, targetUser);
    console.log(`Created ${testUsers.length} test users`);
    
    // Create JWT tokens for authentication
    const secret = process.env.JWT_SECRET || 'dev-jwt-secret';
    
    // Token for the first user
    accessTokens.user1 = jwt.sign(
      { userId: deleteUser.id, email: deleteUser.email },
      secret,
      { expiresIn: '1h' }
    );
    
    // Token for the second user
    accessTokens.user2 = jwt.sign(
      { userId: targetUser.id, email: targetUser.email },
      secret,
      { expiresIn: '1h' }
    );
    
    console.log('Test tokens created for users');
    
  } catch (error) {
    console.error('Error in test setup:', error);
    throw error;
  }
}, 30000);

// Cleanup after all tests
afterAll(async () => {
  try {
    // Delete any remaining test users
    if (testUsers.length > 0) {
      for (const user of testUsers) {
        try {
          await db('users').where('id', user.id).delete();
          console.log(`Cleaned up test user: ${user.id}`);
        } catch (err) {
          // User might have been deleted by the test
          console.log(`Could not delete test user: ${user.id}, may have been deleted already`);
        }
      }
    }
    
    // Close server
    if (server) {
      await new Promise(resolve => {
        server.close(() => {
          console.log('Delete user test server closed');
          resolve(true);
        });
      });
    }
  } catch (error) {
    console.error('Error in test cleanup:', error);
  }
}, 30000);

describe('Delete User API - Success Cases', () => {
  it('should successfully delete own user account', async () => {
    // Skip if users array is empty
    if (testUsers.length === 0) {
      console.log('Skipping test: No test users');
      return;
    }
    
    const deleteUser = testUsers.find(user => user.id.startsWith('delete-user-'));
    if (!deleteUser) {
      console.log('Skipping test: Delete user not found');
      return;
    }
    
    // First check if the user exists
    const userBeforeDelete = await db('users').where('id', deleteUser.id).first();
    expect(userBeforeDelete).not.toBeUndefined();
    console.log('User exists before deletion:', deleteUser.id);
    
    // Delete the user
    const response = await request
      .delete(`/api/user/me`)
      .set('Authorization', `Bearer ${accessTokens.user1}`);
    
    console.log('Delete user response:', response.status, response.body);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('deleted');
    
    // Verify the user is actually deleted from the database
    const userAfterDelete = await db('users').where('id', deleteUser.id).first();
    expect(userAfterDelete).toBeUndefined();
    console.log('User confirmed deleted from database');
    
    // Remove this user from the array so we don't try to delete it again in cleanup
    testUsers = testUsers.filter(user => user.id !== deleteUser.id);
  });
  
  it('should prevent accessing /me with invalid tokens (access control)', async () => {
    // Skip if users array is empty
    if (testUsers.length === 0) {
      console.log('Skipping test: No test users');
      return;
    }
    
    const targetUser = testUsers.find(user => user.id.startsWith('target-user-'));
    if (!targetUser) {
      console.log('Skipping test: Target user not found');
      return;
    }
    
    // Create an invalid token
    const invalidToken = 'invalid-token-12345';
    
    // Try to access /me with invalid token
    const response = await request
      .get(`/api/user/me`)
      .set('Authorization', `Bearer ${invalidToken}`);
    
    console.log('Invalid token response:', response.status, response.body);
    
    // The API should reject invalid tokens with 401 Unauthorized
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
  
  it('should require authentication to delete user', async () => {
    // Create a new test user just for this test
    const timestamp = Date.now();
    const testUser = {
      id: `auth-test-user-${timestamp}`,
      username: `authtest_${timestamp}`,
      email: `authtest_${timestamp}@example.com`,
      password_hash: 'test-hash-3',
      age: '35_44',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Insert the test user
    await db('users').insert(testUser);
    testUsers.push(testUser);
    console.log('Created authentication test user:', testUser.id);
    
    // Try to delete without authorization
    const response = await request
      .delete(`/api/user/me`);
    
    console.log('Delete without auth response:', response.status);
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
    
    // Verify the user still exists in the database
    const userAfterAttempt = await db('users').where('id', testUser.id).first();
    expect(userAfterAttempt).not.toBeUndefined();
    console.log('Authentication test user still exists after unauthenticated delete attempt');
  });
}); 