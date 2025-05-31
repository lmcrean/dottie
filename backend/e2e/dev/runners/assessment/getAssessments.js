/**
 * Get Assessments Utility for Integration Tests (Playwright)
 */

/**
 * Get all assessments for a user
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} List of assessments
 */
export async function getAssessments(request, token) {
  const response = await request.get("/api/assessment/list", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  let responseText;
  try {
    responseText = await response.text();
  } catch (error) {
    console.error("Failed to get response text:", error);
  }

  // If we get a 404 (no assessments found), return an empty array
  if (response.status() === 404) {
    return [];
  }

  let result;
  try {
    if (responseText) {
      result = JSON.parse(responseText);
    }
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    throw new Error(`Failed to parse assessments list response: ${error.message}`);
  }

  if (response.status() !== 200) {
    throw new Error(`Failed to get assessments: ${response.status()}`);
  }

  return result;
} 