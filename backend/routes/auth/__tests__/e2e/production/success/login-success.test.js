// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../../../../../../server.js';
import { createServer } from 'http';
import db from '../../../../../../db/index.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

// Create a supertest instance
const request = supertest(app);

// Store server instance
let server;

// Use a different port for tests
const TEST_PORT = 5012;

// Start server before all tests
beforeAll(async () => {
  // Initialize test database first
  console.log('Initializing database for login tests...');
  
  try {
    // Clear any existing data
    await db('assessments').delete();
    await db('symptoms').delete();
    await db('period_logs').delete();
    await db('users').delete();
    
    console.log('Test database cleared');
  } catch (error) {
    console.error('Error clearing test database:', error);
  }
  
  server = createServer(app);
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`Login success test server started on port ${TEST_PORT}`);
      resolve(true);
    });
  });
}, 15000);

// Close server after all tests
afterAll(async () => {
  if (server) {
    await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
      server.close(() => {
        console.log('Login success test server closed');
        resolve(true);
      });
    });
  }
}, 15000);

describe("User Login - Success Scenarios", { tags: ['authentication', 'dev', 'success'] }, () => {
  // Create a test user first
  const testUser = {
    username: `logintest_${Date.now()}`,
    email: `logintest_${Date.now()}@example.com`,
    password: "Password123!",
    age: "18_24"
  };

  // Before running tests, create the test user
  beforeAll(async () => {
    await request
      .post("/api/auth/signup")
      .send(testUser);
  });

  test("Should authenticate user with valid credentials", async () => {
    const loginData = {
      email: testUser.email,
      password: testUser.password
    };

    const response = await request
      .post("/api/auth/login")
      .send(loginData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("email", testUser.email);
  });

  test("Should return refresh token for valid login", async () => {
    const loginData = {
      email: testUser.email,
      password: testUser.password
    };

    const response = await request
      .post("/api/auth/login")
      .send(loginData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("refreshToken");
    expect(typeof response.body.refreshToken).toBe("string");
  });
}); 