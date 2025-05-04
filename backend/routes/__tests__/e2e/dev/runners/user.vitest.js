/**
 * User Utilities for Integration Tests (Vitest/Supertest Version)
 *
 * This file contains helper functions for user-related operations using supertest.
 */

/**
 * Get user information by ID (uses /me endpoint)
 * @param {import('supertest').SuperTest<import('supertest').Test>} request - Supertest agent
 * @param {string} token - Authentication token
 * @param {string} userId - User ID (not used by /me endpoint, but kept for consistency)
 * @returns {Promise<Object>} User data
 */
export async function getUserById(request, token, userId) {
  // Use supertest: get(url).set(header, value)
  const response = await request.get(`/api/auth/users/me`)
    .set('Authorization', `Bearer ${token}`);

  console.log(`Get user response status:`, response.status);
  console.log(`Get user response body:`, JSON.stringify(response.body).substring(0, 150));

  if (response.status !== 200) {
    const error = new Error(`Failed to get user info: ${response.status}`);
    error.response = response;
    throw error;
  }

  // Return already parsed body
  return response.body;
}

/**
 * Get all users (admin operation)
 * @param {import('supertest').SuperTest<import('supertest').Test>} request - Supertest agent
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} List of users
 */
export async function getAllUsers(request, token) {
  // Use supertest: get(url).set(header, value)
  const response = await request.get("/api/auth/users")
    .set('Authorization', `Bearer ${token}`);

  console.log(`Get all users status:`, response.status);
  console.log(`Get all users body:`, JSON.stringify(response.body).substring(0, 150));

  if (response.status !== 200) {
    const error = new Error(`Failed to get all users: ${response.status}`);
    error.response = response;
    throw error;
  }

  return response.body;
}

/**
 * Update user profile information (uses /me endpoint)
 * @param {import('supertest').SuperTest<import('supertest').Test>} request - Supertest agent
 * @param {string} token - Authentication token
 * @param {string} userId - User ID (not used by /me endpoint)
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} Updated user data
 */
export async function updateUserProfile(request, token, userId, profileData) {
  // Use supertest: put(url).set(header, value).send(data)
  const response = await request.put(`/api/auth/users/me`)
    .set('Authorization', `Bearer ${token}`)
    .send(profileData);

  console.log(`Update user status:`, response.status);
  console.log(`Update user body:`, JSON.stringify(response.body).substring(0, 150));

  if (response.status !== 200) {
    const error = new Error(`Failed to update user profile: ${response.status}`);
    error.response = response;
    throw error;
  }

  return response.body;
}

/**
 * Delete a user account
 * @param {import('supertest').SuperTest<import('supertest').Test>} request - Supertest agent
 * @param {string} token - Authentication token
 * @param {string} userId - User ID to delete
 * @returns {Promise<boolean>} True if deleted successfully
 */
export async function deleteUser(request, token, userId) {
  // Use supertest: delete(url).set(header, value)
  const response = await request.delete(`/api/auth/users/${userId}`)
    .set('Authorization', `Bearer ${token}`);

  console.log(`Delete user ${userId} status:`, response.status);
  try {
    console.log(`Delete user response body:`, JSON.stringify(response.body || response.text).substring(0, 150));
  } catch (error) {
    console.error("Error logging delete response body:", error);
  }

  // Check for successful status (e.g., 200 OK or 204 No Content)
  return response.status === 200 || response.status === 204;
}

/**
 * Generate random profile data for updating user
 * @param {string} usernamePrefix - Prefix for username
 * @returns {Object} Profile update data
 */
export function generateProfileUpdate(usernamePrefix = "updated") {
  const timestamp = Date.now();
  return {
    username: `${usernamePrefix}_${timestamp}`,
    age: "25_34",
  };
} 