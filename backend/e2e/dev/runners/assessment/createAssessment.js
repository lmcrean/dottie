/**
 * Create Assessment Utility for Integration Tests (Playwright)
 */

/**
 * Create a new assessment
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} userId - User ID
 * @param {Object} assessmentData - Assessment data
 * @returns {Promise<string>} Assessment ID
 */
export async function createAssessment(
  request,
  token,
  userId,
  assessmentData = null
) {
  // Import the default assessment generator if needed
  const { generateDefaultAssessment } = await import('./generateDefaultAssessment.js');
  
  // If no assessment data provided, use default test data
  const data = assessmentData || generateDefaultAssessment();

  // Convert to flattened format with snake_case fields
  const flattenedData = {
    userId: userId,
    // Use the flattened format fields directly
    assessmentData: {
      // These are direct fields, not nested
      age: data.age,
      cycle_length: data.cycleLength,
      period_duration: data.periodDuration,
      flow_heaviness: data.flowHeaviness,
      pain_level: data.painLevel,
      physical_symptoms: data.symptoms?.physical || [],
      emotional_symptoms: data.symptoms?.emotional || [],
      recommendations: data.recommendations || [], // Include recommendations
      pattern: data.pattern // Include the calculated pattern
    }
  };

  const response = await request.post("/api/assessment/send", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: flattenedData,
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
    throw new Error(`Failed to parse assessment creation response: ${error.message}`);
  }

  if (response.status() !== 201) {
    throw new Error(`Failed to create assessment: ${response.status()}`);
  }

  return result.id;
} 