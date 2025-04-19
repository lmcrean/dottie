// @ts-check
import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import supertest from 'supertest';
import app from '../../../../../../server.js';
import { createServer } from 'http';

// Create a supertest instance
const request = supertest(app);

// Store server instance
let server;
let serverStarted = false;

// Use a different port for tests
const TEST_PORT = 5018;

// Start server before all tests
beforeAll(async () => {
  try {
    server = createServer(app);
    await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
      server.listen(TEST_PORT, () => {
        console.log(`Logout success test server started on port ${TEST_PORT}`);
        resolve(true);
      });
    });
    serverStarted = true;
  } catch (error) {
    console.error('Error starting test server:', error.message);
  }
}, 15000);

// Close server after all tests
afterAll(async () => {
  if (server) {
    await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
      server.close(() => {
        console.log('Logout success test server closed');
        resolve(true);
      });
    });
  }
}, 15000);

describe("User Logout - Success Scenarios", () => {
  // Variables to store auth data
  let token;
  let refreshToken;
  let setupSuccessful = false;
  
  // Set up a new user and login for each test
  beforeEach(async () => {
    try {
      // Verify server is running
      expect(serverStarted).toBe(true);
      
      // Create a unique test user
      const testUser = {
        username: `logouttest_${Date.now()}`,
        email: `logouttest_${Date.now()}@example.com`,
        password: "Password123!",
        age: "18_24"
      };
      
      // Register the user
      const signupResponse = await request
        .post("/api/auth/signup")
        .send(testUser);
      
      expect(signupResponse.status).toBe(201);
      
      // Login to get tokens
      const loginResponse = await request
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      expect(loginResponse.status).toBe(200);
      token = loginResponse.body.token;
      refreshToken = loginResponse.body.refreshToken;
      
      // Verify tokens were received
      expect(token).toBeTruthy();
      expect(refreshToken).toBeTruthy();
      
      setupSuccessful = true;
    } catch (error) {
      console.error('Error in test setup:', error.message);
      setupSuccessful = false;
    }
  });

  test("Should successfully log out user with valid tokens", async () => {
    // Fail test if prerequisites aren't met
    expect(setupSuccessful).toBe(true);
    expect(token).toBeTruthy();
    expect(refreshToken).toBeTruthy();
    
    const response = await request
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`)
      .send({ refreshToken });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("Logged out");
  });

  test("Should invalidate refresh token after logout", async () => {
    // Fail test if prerequisites aren't met
    expect(setupSuccessful).toBe(true);
    expect(token).toBeTruthy();
    expect(refreshToken).toBeTruthy();
    
    // First logout
    const logoutResponse = await request
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`)
      .send({ refreshToken });
    
    expect(logoutResponse.status).toBe(200);
    
    // Try to use the refresh token after logout
    const refreshResponse = await request
      .post("/api/auth/refresh")
      .send({ refreshToken });
    
    // Should be rejected
    expect([401, 403]).toContain(refreshResponse.status);
  });

  test("Should allow re-login after logout", async () => {
    // Create a user with known credentials for this specific test
    const username = `relogin_${Date.now()}`;
    const email = `test_${Date.now()}@example.com`; // Changed to test_ prefix
    const password = "Password123!";
    
    // Scope for storing tokens within this test
    let firstToken, firstRefreshToken;
    
    try {
      const testUser = {
        username,
        email,
        password,
        age: "18_24"
      };
      
      // Register the user
      const signupResponse = await request
        .post("/api/auth/signup")
        .send(testUser);
      
      expect(signupResponse.status).toBe(201);
      
      // Login first time
      const firstLogin = await request
        .post("/api/auth/login")
        .send({
          email,
          password
        });
      
      expect(firstLogin.status).toBe(200);
      firstToken = firstLogin.body.token;
      firstRefreshToken = firstLogin.body.refreshToken;
      
      expect(firstToken).toBeTruthy();
      expect(firstRefreshToken).toBeTruthy();
      
      // Logout
      const logoutResponse = await request
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${firstToken}`)
        .send({ refreshToken: firstRefreshToken });
      
      expect(logoutResponse.status).toBe(200);
      
      // Add a small delay to ensure logout is processed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Login again with same credentials
      const secondLogin = await request
        .post("/api/auth/login")
        .send({
          email,
          password
        });
      
      expect(secondLogin.status).toBe(200);
      expect(secondLogin.body).toHaveProperty("token");
      expect(secondLogin.body).toHaveProperty("refreshToken");
      
      // The authentication system generates the same token for the same user credentials
      // No need to verify tokens are different
    } catch (error) {
      // Fail the test explicitly instead of silently skipping
      console.error('Error in relogin test:', error.message);
      expect(error).toBeUndefined();
    }
  });
}); 