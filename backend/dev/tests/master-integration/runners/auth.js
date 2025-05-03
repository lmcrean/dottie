/**
 * Authentication Utilities for Integration Tests
 *
 * This file contains helper functions for authentication-related operations
 * in integration tests, like user registration, login, and token management.
 */

/**
 * Register a new user
 * @param {Object} request - Playwright request object
 * @param {Object} userData - User data for registration
 * @returns {Promise<Object>} Result with user ID and token
 */
export async function registerUser(request, userData) {
  const response = await request.post("/api/auth/signup", {
    data: userData,
  });

  const data = await response.json();

  if (response.status() !== 201) {
    console.error("Registration failed:", data);
    throw new Error(`Failed to register user: ${response.status()}`);
  }

  // The API directly returns the user object and doesn't wrap it in a 'user' property
  // and the token is generated separately - we'll handle this by logging in after registration
  return {
    userId: data.id, // Use the user ID directly from the response
    userData: data,
    // We'll need to log in to get the token
    token: null,
  };
}

/**
 * Login with existing user credentials
 * @param {Object} request - Playwright request object
 * @param {Object} credentials - Login credentials
 * @returns {Promise<string>} Authentication token
 */
export async function loginUser(request, credentials) {
  const response = await request.post("/api/auth/login", {
    data: {
      email: credentials.email,
      password: credentials.password,
    },
  });

  const data = await response.json();

  if (response.status() !== 200) {
    console.error("Login failed:", data);
    throw new Error(`Failed to login: ${response.status()}`);
  }

  if (!data.token) {
    console.error("No token in login response:", data);
    throw new Error("Invalid login response format");
  }

  return data.token;
}

/**
 * Verify authentication token is valid
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @returns {Promise<boolean>} True if token is valid
 */
export async function verifyToken(request, token) {
  // Try to access a protected endpoint to verify the token

  if (!token) {
    console.error("No token provided for verification");
    return false;
  }

  try {
    const response = await request.get("/api/auth/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.status() === 200;
  } catch (error) {
    console.error("Token verification error:", error);
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
