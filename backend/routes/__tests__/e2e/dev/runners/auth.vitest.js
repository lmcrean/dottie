/**
 * Authentication Utilities for Integration Tests (Vitest/Supertest Version)
 *
 * This file contains helper functions for authentication-related operations
 * using supertest.
 */

/**
 * Register a new user
 * @param {import('supertest').SuperTest<import('supertest').Test>} request - Supertest agent
 * @param {Object} userData - User data for registration
 * @returns {Promise<Object>} Result with user ID and user data
 */
export async function registerUser(request, userData) {
  // Use supertest: post(url).send(data)
  const response = await request.post("/api/auth/signup")
    .send(userData);

  // Check status directly from response.status
  if (response.status !== 201) {
    console.error("Registration failed:", response.body || response.text);
    // Throw the error object from supertest which contains response details
    const error = new Error(`Failed to register user: ${response.status}`);
    error.response = response; // Attach response for debugging
    throw error;
  }

  // Supertest automatically parses JSON body
  const data = response.body;

  return {
    userId: data.id,
    userData: data,
    token: null, // Still need to login separately
  };
}

/**
 * Login with existing user credentials
 * @param {import('supertest').SuperTest<import('supertest').Test>} request - Supertest agent
 * @param {Object} credentials - Login credentials
 * @returns {Promise<string>} Authentication token
 */
export async function loginUser(request, credentials) {
  // Use supertest: post(url).send(data)
  const response = await request.post("/api/auth/login")
    .send({
      email: credentials.email,
      password: credentials.password,
    });

  // Check status
  if (response.status !== 200) {
    console.error("Login failed:", response.body || response.text);
    const error = new Error(`Failed to login: ${response.status}`);
    error.response = response;
    throw error;
  }

  // Access parsed body
  const data = response.body;

  if (!data.token) {
    console.error("No token in login response:", data);
    throw new Error("Invalid login response format");
  }

  return data.token;
}

/**
 * Verify authentication token is valid
 * @param {import('supertest').SuperTest<import('supertest').Test>} request - Supertest agent
 * @param {string} token - Authentication token
 * @returns {Promise<boolean>} True if token is valid
 */
export async function verifyToken(request, token) {
  if (!token) {
    console.error("No token provided for verification");
    return false;
  }

  try {
    // Use supertest: get(url).set(header, value)
    const response = await request.get("/api/auth/users")
      .set("Authorization", `Bearer ${token}`);

    // Check status directly
    return response.status === 200;
  } catch (error) {
    // Catch network/request errors, not HTTP status errors
    console.error("Token verification request error:", error);
    return false;
  }
}

/**
 * Generate unique test user data
 * @returns {Object} User data for registration
 */
export function generateTestUser() {
  const timestamp = Date.now();
  return {
    username: `testuser-${timestamp}`,
    email: `test-${timestamp}@example.com`,
    password: "TestPassword123!",
  };
} 