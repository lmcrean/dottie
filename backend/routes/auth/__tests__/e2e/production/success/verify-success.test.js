// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../../../../../../server.js';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';

// Create a supertest instance
const request = supertest(app);

// Store server instance
let server;
let testToken;
let testUserId;
let loginToken;
let setupSuccessful = false;

// Use a different port for tests
const TEST_PORT = 5014;

// Helper to create a valid token
const createToken = (userId) => {
  return jwt.sign(
    { id: userId, email: `verify_${Date.now()}@example.com` },
    process.env.JWT_SECRET || 'dev-jwt-secret',
    { expiresIn: '1h' }
  );
};

// Start server before all tests
beforeAll(async () => {
  try {
    server = createServer(app);
    await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
      server.listen(TEST_PORT, () => {
        console.log(`Verify success test server started on port ${TEST_PORT}`);
        resolve(true);
      });
    });

    // Create test user
    const testUser = {
      username: `verifytest_${Date.now()}`,
      email: `verifytest_${Date.now()}@example.com`,
      password: "Password123!",
      age: "18_24"
    };

    const response = await request
      .post("/api/auth/signup")
      .send(testUser);

    expect(response.status).toBe(201);
    testUserId = response.body.id;
    expect(testUserId).toBeTruthy();
    
    // Generate token
    testToken = createToken(testUserId);
    expect(testToken).toBeTruthy();
    
    setupSuccessful = true;
    console.log('Test setup successful, token created');
  } catch (error) {
    console.error('Error during test setup:', error.message);
    // The test will fail in the describe block if setupSuccessful remains false
  }
}, 15000);

// Close server after all tests
afterAll(async () => {
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.close(() => {
      console.log('Verify success test server closed');
      resolve(true);
    });
  });
}, 15000);

describe("Token Verification - Success Scenarios", () => {
  test("Should verify valid token and return user info", async () => {
    // Fail test if prerequisites aren't met
    expect(setupSuccessful).toBe(true);
    expect(testToken).toBeTruthy();
    
    const response = await request
      .get("/api/auth/verify")
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("authenticated", true);
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user).toHaveProperty("verified_at");
  });

  test("Should verify token from login", async () => {
    try {
      // Login to get a real token
      const testUser = {
        username: `login_verify_${Date.now()}`,
        email: `login_verify_${Date.now()}@example.com`,
        password: "Password123!",
        age: "18_24"
      };
  
      // Create the user
      const signupResponse = await request
        .post("/api/auth/signup")
        .send(testUser);
      
      expect(signupResponse.status).toBe(201);
      
      // Login to get token
      const loginResponse = await request
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      expect(loginResponse.status).toBe(200);
      loginToken = loginResponse.body.token;
      expect(loginToken).toBeTruthy();
      
      // Verify the token
      const verifyResponse = await request
        .get("/api/auth/verify")
        .set("Authorization", `Bearer ${loginToken}`);
      
      expect(verifyResponse.status).toBe(200);
      expect(verifyResponse.body).toHaveProperty("authenticated", true);
      expect(verifyResponse.body.user).toHaveProperty("email", testUser.email);
      expect(verifyResponse.body.user).toHaveProperty("verified_at");
    } catch (error) {
      // Fail the test with the error rather than silently skipping
      expect(error).toBeUndefined();
    }
  });
}); 