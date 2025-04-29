// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../../../../../server.js';
import { createServer } from 'http';

// Create a supertest instance
const request = supertest(app);

// Store server instance
let server;

// Use a different port for tests
const TEST_PORT = 5055;

// Start server before all tests
beforeAll(async () => {
  server = createServer(app);
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`Local auth integration test server started on port ${TEST_PORT}`);
      resolve(true);
    });
  });
}, 15000); // Increased timeout to 15 seconds

// Close server after all tests
afterAll(async () => {
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.close(() => {
      console.log('Local auth integration test server closed');
      resolve(true);
    });
  });
}, 15000); // Increased timeout to 15 seconds

describe("Authentication Local Integration Test", () => {
  // Generate unique test user for this test run
  const uniqueId = Date.now();
  const testUser = {
    username: `test_user_${uniqueId}`,
    email: `test_user_${uniqueId}@example.com`,
    password: "SecureTest123!",
  };

  // Log the test user details
  console.log('Test user:', testUser);

  // Store user data and tokens between tests
  let userId = null;
  let authToken = null;
  let refreshToken = null;

  test("Should verify database connection before tests", async () => {
    const response = await request.get("/api/setup/database/status");
    console.log('Database status response:', response.body);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status");
  });

  test("Should register a new user successfully", async () => {
    const response = await request.post("/api/auth/signup").send(testUser);
    console.log('Signup response:', response.status, response.body);
    
    // If there's an error, log it
    if (response.status !== 201) {
      console.log('Signup error response:', response.body);
    }
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("username", testUser.username);
    expect(response.body).toHaveProperty("email", testUser.email);
    
    // Store the user ID for later tests
    userId = response.body.id;
  });

  test("Should login with the newly created user", async () => {
    // Skip if signup failed
    if (!userId) {
      console.log("Skipping login test - no user ID available");
      return;
    }
    
    const loginData = {
      email: testUser.email,
      password: testUser.password,
    };

    const response = await request.post("/api/auth/login").send(loginData);
    console.log('Login response:', response.status, response.body);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("refreshToken");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("email", testUser.email);
    
    // Store tokens for subsequent tests
    authToken = response.body.token;
    refreshToken = response.body.refreshToken;
  });

  test("Should access protected endpoint with valid token", async () => {
    // Skip if login test failed
    if (!authToken) {
      console.log("Skipping protected endpoint test - no auth token available");
      return;
    }

    const response = await request
      .get("/api/auth/users")
      .set("Authorization", `Bearer ${authToken}`);
    
    console.log('Protected endpoint response:', response.status, response.body);
    
    expect(response.status).toBe(200);
  });

  // Test refresh token functionality
  test("Should refresh auth token with valid refresh token", async () => {
    // Skip if login test failed
    if (!refreshToken) {
      console.log("Skipping token refresh test - no refresh token available");
      return;
    }

    const response = await request.post("/api/auth/refresh").send({
      refreshToken: refreshToken,
    });
    
    console.log('Refresh token response:', response.status, response.body);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.token).not.toBe(authToken); // New token should be different
  });
});
