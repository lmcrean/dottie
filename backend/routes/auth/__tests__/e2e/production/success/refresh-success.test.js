// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../../../../../../server.js';
import { createServer } from 'http';

// Create a supertest instance
const request = supertest(app);

// Store server instance
let server;
let refreshToken;
let authToken;
let testUser;
let setupSuccessful = false;

// Use a different port for tests
const TEST_PORT = 5016;

// Start server before all tests
beforeAll(async () => {
  try {
    server = createServer(app);
    await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
      server.listen(TEST_PORT, () => {
        console.log(`Refresh token success test server started on port ${TEST_PORT}`);
        resolve(true);
      });
    });
  
    // Create test user and get refresh token
    testUser = {
      username: `refreshtest_${Date.now()}`,
      email: `refreshtest_${Date.now()}@example.com`,
      password: "Password123!",
      age: "18_24"
    };
  
    // Register the user
    const registerResponse = await request
      .post("/api/auth/signup")
      .send(testUser);
    
    expect(registerResponse.status).toBe(201);
    
    // Login to get refresh token
    const loginResponse = await request
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    expect(loginResponse.status).toBe(200);
    
    authToken = loginResponse.body.token;
    refreshToken = loginResponse.body.refreshToken;
    
    // Validate tokens were received
    expect(authToken).toBeTruthy();
    expect(refreshToken).toBeTruthy();
    
    setupSuccessful = true;
    console.log('Test setup successful, tokens received');
  } catch (error) {
    console.error('Error during test setup:', error.message);
    // The test will fail in the describe block if setupSuccessful remains false
  }
}, 15000);

// Close server after all tests
afterAll(async () => {
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.close(() => {
      console.log('Refresh token success test server closed');
      resolve(true);
    });
  });
}, 15000);

describe("Token Refresh - Success Scenarios", () => {
  test("Should refresh token with valid refresh token", async () => {
    // Fail test if setup wasn't successful
    expect(setupSuccessful).toBe(true);
    expect(refreshToken).toBeTruthy();
    
    const response = await request
      .post("/api/auth/refresh")
      .send({ refreshToken });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe("string");
    
    // JWT tokens have 3 parts separated by periods
    const tokenParts = response.body.token.split('.');
    expect(tokenParts.length).toBe(3);
    
    // Store new token for next test
    authToken = response.body.token;
  });

  test("Should return valid token that can be used for authenticated requests", async () => {
    // Fail test if prerequisites aren't met
    expect(setupSuccessful).toBe(true);
    expect(authToken).toBeTruthy();
    
    // Use token to access protected endpoint
    const verifyResponse = await request
      .get("/api/auth/verify")
      .set("Authorization", `Bearer ${authToken}`);
    
    expect(verifyResponse.status).toBe(200);
    expect(verifyResponse.body).toHaveProperty("authenticated", true);
  });
}); 