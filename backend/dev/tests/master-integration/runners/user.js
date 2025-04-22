/**
 * User Utilities for Integration Tests
 *
 * This file contains helper functions for user-related operations
 * in integration tests, such as getting user info, updating profiles, etc.
 */

/**
 * Get user information by ID
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User data
 */
export async function getUserById(request, token, userId) {
  const response = await request.get(`/api/auth/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (response.status() !== 200) {
    throw new Error(`Failed to get user info: ${response.status()}`);
  }

  return data;
}

/**
 * Get all users (admin operation)
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} List of users
 */
export async function getAllUsers(request, token) {
  const response = await request.get("/api/auth/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (response.status() !== 200) {
    throw new Error(`Failed to get all users: ${response.status()}`);
  }

  return data;
}

/**
 * Update user profile information
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} userId - User ID
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} Updated user data
 */
export async function updateUserProfile(request, token, userId, profileData) {
  const response = await request.put(`/api/auth/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: profileData,
  });

  const responseText = await response.text();

  if (response.status() !== 200) {
    throw new Error(`Failed to update user profile: ${response.status()}`);
  }

  // Parse the JSON response
  try {
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    throw new Error(`Failed to parse update response: ${error.message}`);
  }
}

/**
 * Delete a user account
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} True if deleted successfully
 */
export async function deleteUser(request, token, userId) {
  const response = await request.delete(`/api/auth/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  try {
    const responseText = await response.text();
  } catch (error) {
    console.error("Failed to get delete response text:", error);
  }

  return response.status() === 200;
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
