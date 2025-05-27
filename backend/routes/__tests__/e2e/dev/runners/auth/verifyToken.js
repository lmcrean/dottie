/**
 * Verify Token Utility for Integration Tests (Playwright)
 */

/**
 * Verify authentication token is valid
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @returns {Promise<boolean>} True if token is valid
 * @throws {Error} If token is invalid or verification fails
 */
export async function verifyToken(request, token) {
  // Try to access a protected endpoint to verify the token

  if (!token) {
    throw new Error("No token provided for verification");
  }

  try {
    const response = await request.get("/api/auth/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status() !== 200) {
      throw new Error(`Token verification failed with status: ${response.status()}`);
    }

    return true;
  } catch (error) {
    if (error.message.includes('Token verification failed')) {
      throw error;
    }
    throw new Error(`Token verification error: ${error.message}`);
  }
} 