/**
 * Get All Users Utility for Integration Tests (Playwright)
 */

/**
 * Get all users (admin operation)
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} List of users
 */
export async function getAllUsers(request, token) {
  const response = await request.get("/api/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Get response as text first
  const responseText = await response.text();

  if (response.status() !== 200) {
    throw new Error(`Failed to get all users: ${response.status()}`);
  }

  // Parse the JSON response
  try {
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    throw new Error(`Failed to parse users list response: ${error.message}`);
  }
} 