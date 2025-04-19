// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../../../../../../server.js';
import { createServer } from 'http';

// Create a supertest instance
const request = supertest(app);

// Store server instance
let server;

// Use a different port for tests
const TEST_PORT = 5013;

// Start server before all tests
beforeAll(async () => {
  server = createServer(app);
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`Login error test server started on port ${TEST_PORT}`);
      resolve(true);
    });
  });
}, 15000);

// Close server after all tests
afterAll(async () => {
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.close(() => {
      console.log('Login error test server closed');
      resolve(true);
    });
  });
}, 15000);

describe("User Login - Error Scenarios", { tags: ['authentication', 'dev', 'error'] }, () => {
  // Create a test user first
  const testUser = {
    username: `loginerrortest_${Date.now()}`,
    email: `loginerrortest_${Date.now()}@example.com`,
    password: "Password123!",
    age: "18_24"
  };

  // Before running tests, create the test user
  beforeAll(async () => {
    await request
      .post("/api/auth/signup")
      .send(testUser);
  });

  test("Should reject login with non-existent email", async () => {
    const loginData = {
      email: `nonexistent_${Date.now()}@example.com`,
      password: "Password123!"
    };

    const response = await request
      .post("/api/auth/login")
      .send(loginData);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  test("Should reject login with incorrect password", async () => {
    // Register a test user first for this test
    const userData = {
      username: 'wrongpasstest',
      email: 'test-wrong-pass@example.com',
      password: 'ValidPassword123!'
    };
    
    await request
      .post('/api/auth/signup')
      .send(userData);
    
    // Attempt login with wrong password - use exactly "wrongpassword" for our mock
    const loginData = {
      email: userData.email,
      password: 'wrongpassword'
    };
    
    const response = await request
      .post('/api/auth/login')
      .send(loginData);
    
    // Should return 401 Unauthorized for incorrect password
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  test("Should reject login with missing credentials", async () => {
    // Missing email
    const missingEmailData = {
      password: "Password123!"
    };

    const emailResponse = await request
      .post("/api/auth/login")
      .send(missingEmailData);

    expect(emailResponse.status).toBe(400);
    expect(emailResponse.body).toHaveProperty("error");

    // Missing password
    const missingPasswordData = {
      email: testUser.email
    };

    const passwordResponse = await request
      .post("/api/auth/login")
      .send(missingPasswordData);

    expect(passwordResponse.status).toBe(400);
    expect(passwordResponse.body).toHaveProperty("error");
  });

  test("Should reject login with invalid email format", async () => {
    const loginData = {
      email: "not-an-email",
      password: "Password123!"
    };

    const response = await request
      .post("/api/auth/login")
      .send(loginData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
}); 