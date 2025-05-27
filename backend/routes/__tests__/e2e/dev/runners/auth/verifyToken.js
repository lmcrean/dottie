/**
 * Verify Token Utility for Integration Tests (Playwright)
 */

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