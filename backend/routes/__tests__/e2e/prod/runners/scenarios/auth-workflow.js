/**
 * Authentication Workflow Scenario
 * 
 * Handles complete user registration and authentication flow.
 */

import * as auth from '../auth/index.js';

/**
 * Complete authentication workflow: register + login + verify
 * @param {Object} request - Playwright request object
 * @param {Object} expect - Playwright expect function
 * @returns {Promise<Object>} Authentication result with user data and token
 */
export async function runAuthWorkflow(request, expect) {
  // Generate test user data
  const testUser = auth.generateTestUser();

  // Register the user
  const registrationResult = await auth.registerUser(request, testUser);
  expect(registrationResult.userId).toBeTruthy();
  expect(registrationResult.userData.username).toBe(testUser.username);

  // Login with the registered user
  const authToken = await auth.loginUser(request, {
    email: testUser.email,
    password: testUser.password,
  });
  expect(authToken).toBeTruthy();

  // Verify the token is valid
  const isValid = await auth.verifyToken(request, authToken);
  expect(isValid).toBeTruthy();

  return {
    testUser,
    userId: registrationResult.userId,
    authToken,
    userData: registrationResult.userData
  };
}

/**
 * Test basic health endpoints
 * @param {Object} request - Playwright request object
 * @param {Object} expect - Playwright expect function
 */
export async function runHealthCheck(request, expect) {
  // Test health hello endpoint
  const helloResponse = await request.get("/api/setup/health/hello");
  expect(helloResponse.status()).toBe(200);
  const helloData = await helloResponse.json();
  expect(helloData).toHaveProperty('message');
  expect(helloData.message).toBe('Hello World from Dottie API!');

  // Test database status endpoint
  const dbStatusResponse = await request.get("/api/setup/database/status");
  expect([200, 500]).toContain(dbStatusResponse.status());
  
  if (dbStatusResponse.status() === 200) {
    const dbStatusData = await dbStatusResponse.json();
    expect(dbStatusData).toHaveProperty('status');
  }
} 