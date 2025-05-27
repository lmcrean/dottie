/**
 * Create Assessment Endpoint Runner
 * 
 * Handles creating new assessments for integration tests.
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
  // If no assessment data provided, use default test data
  const { generateDefaultAssessment } = await import('./test-data-generators.js');
  const data = assessmentData || generateDefaultAssessment();

  // Use only snake_case format for PostgreSQL compatibility
  // Keep assessmentData as the top-level container to match API expectations
  const payload = {
    assessmentData: {
      // Don't include user_id or userId - let the API use it from the auth token
      // The API will get the user ID from the req.user object after token authentication
      
      // Direct fields with snake_case naming
      age: data.age || "18-24",
      cycle_length: data.cycleLength || data.cycle_length || "26-30",
      period_duration: data.periodDuration || data.period_duration || "4-5",
      flow_heaviness: data.flowHeaviness || data.flow_heaviness || "moderate",
      pain_level: data.painLevel || data.pain_level || "moderate",
      physical_symptoms: data.symptoms?.physical || data.physical_symptoms || ["Bloating", "Headaches"],
      emotional_symptoms: data.symptoms?.emotional || data.emotional_symptoms || ["Mood swings", "Irritability"]
    }
  };

  const response = await request.post("/api/assessment/send", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: payload,
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
      
      // Log detailed error information if available
      if (response.status() !== 201 && result.error) {
        console.error('Error creating assessment:', result.error);
        if (result.details) {
          console.error('Error details:', result.details);
        }
      }
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