/**
 * Delete Assessment Utility for Integration Tests (Playwright)
 */

/**
 * Delete an assessment
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} userId - User ID
 * @param {string} assessmentId - Assessment ID
 * @returns {Promise<boolean>} True if deleted successfully
 */
export async function deleteAssessment(request, token, userId, assessmentId) {
  // Use the correct endpoint format with both userId and assessmentId
  const response = await request.delete(
    `/api/assessment/${userId}/${assessmentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  
  // Log the response for debugging
  try {
    const responseText = await response.text();
  } catch (error) {
    console.error("Failed to get delete response text:", error);
  }

  return response.status() === 200 || response.status() === 204;
} 