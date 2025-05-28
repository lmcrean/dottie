/**
 * Get Assessment By ID Utility for Integration Tests (Playwright)
 */

/**
 * Get a specific assessment by ID
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} assessmentId - Assessment ID
 * @returns {Promise<Object>} Assessment data
 */
export async function getAssessmentById(request, token, assessmentId) {
  const response = await request.get(`/api/assessment/${assessmentId}`, {
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

  let result;
  try {
    if (responseText) {
      result = JSON.parse(responseText);
    }
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    throw new Error(`Failed to parse assessment response: ${error.message}`);
  }

  if (response.status() !== 200) {
    throw new Error(`Failed to get assessment: ${response.status()}`);
  }

  return result;
} 