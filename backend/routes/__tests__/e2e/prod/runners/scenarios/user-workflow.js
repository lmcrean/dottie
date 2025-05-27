/**
 * User Management Workflow Scenario
 * 
 * Handles complete user management operations.
 */

import * as user from '../user/index.js';

/**
 * Complete user management workflow
 * @param {Object} request - Playwright request object
 * @param {Object} expect - Playwright expect function
 * @param {string} authToken - Authentication token
 * @param {string} userId - User ID
 * @param {Object} testUser - Original test user data
 * @returns {Promise<Object>} Updated user data
 */
export async function runUserManagementWorkflow(request, expect, authToken, userId, testUser) {
  // Get user information
  const userData = await user.getUserById(request, authToken, userId);
  expect(userData.id).toBe(userId);
  expect(userData.username).toBe(testUser.username);
  expect(userData.email).toBe(testUser.email);

  // Generate and apply profile update
  const profileUpdate = user.generateProfileUpdate();
  const updatedUser = await user.updateUserProfile(
    request,
    authToken,
    userId,
    profileUpdate
  );
  expect(updatedUser.id).toBe(userId);
  expect(updatedUser.username).toBe(profileUpdate.username);
  expect(updatedUser.age).toBe(profileUpdate.age);

  // Test admin operation - get all users
  const allUsers = await user.getAllUsers(request, authToken);
  expect(Array.isArray(allUsers)).toBeTruthy();
  expect(allUsers.some(u => u.id === userId)).toBeTruthy();

  return updatedUser;
} 