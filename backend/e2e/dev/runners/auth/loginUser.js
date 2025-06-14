/**
 * Login User Utility for Integration Tests (Playwright)
 */

/**
 * Login with existing user credentials
 * @param {Object} request - Playwright request object
 * @param {Object} credentials - Login credentials
 * @returns {Promise<string>} Authentication token
 */
export async function loginUser(requestContext, credentials) {
  const response = await requestContext.post("/api/auth/login", {
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

  // ====================================== //

  const sessionResponse = await requestContext.get("/api/debug/session", {
    headers: {
      Authorization: `Bearer ${data.token}`
    }
  });
  


  return data.token;
} 