/**
 * Delete User Endpoint Runner
 * 
 * Handles deleting user accounts for integration tests.
 */

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