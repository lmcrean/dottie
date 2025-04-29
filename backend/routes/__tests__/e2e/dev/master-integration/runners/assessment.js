/**
 * Assessment Utilities for Integration Tests
 *
 * This file contains helper functions for assessment-related operations
 * in integration tests, such as creating, retrieving, updating and deleting assessments.
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
  const data = assessmentData || generateDefaultAssessment();

  const payload = {
    userId: userId,
    assessmentData: data,
  };

  console.log('Creating assessment with payload:', JSON.stringify(payload));
  console.log('Using auth token:', token.substring(0, 20) + '...');

  const response = await request.post("/api/assessment/send", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: payload,
  });

  console.log('Assessment creation response status:', response.status());
  
  let responseText;
  try {
    responseText = await response.text();
    console.log('Assessment creation response body:', responseText);
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

  const result = await response.json();

  if (response.status() !== 200) {
    throw new Error(`Failed to get assessments: ${response.status()}`);
  }

  return result;
}

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

  console.log(`Get assessment by ID ${assessmentId} - Status: ${response.status()}`);
  
  let responseText;
  try {
    responseText = await response.text();
    console.log(`Get assessment response: ${responseText}`);
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

/**
 * Update an existing assessment
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} userId - User ID
 * @param {string} assessmentId - Assessment ID
 * @param {Object} updateData - Updated assessment data
 * @returns {Promise<Object>} Updated assessment
 */
export async function updateAssessment(
  request,
  token,
  userId,
  assessmentId,
  updateData
) {
  // The API might expect the full assessment structure with the updated data
  const payload = {
    userId: userId,
    assessmentData: updateData,
  };

  console.log(`Updating assessment ${assessmentId} for user ${userId}`);
  console.log('Update payload:', JSON.stringify(payload));

  // Try the simpler format first - just the assessment ID
  const response = await request.put(
    `/api/assessment/${assessmentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: payload,
    }
  );

  console.log(`Update assessment status: ${response.status()}`);

  let responseText;
  try {
    responseText = await response.text();
    console.log(`Update assessment response: ${responseText}`);
  } catch (error) {
    console.error("Failed to get response text:", error);
  }

  // Accept 200 or 204 (no content) as success
  if (response.status() !== 200 && response.status() !== 204) {
    throw new Error(`Failed to update assessment: ${response.status()}`);
  }

  let result = {};
  
  try {
    // Try to parse as JSON only if we have content
    if (responseText && responseText.trim() !== '') {
      result = JSON.parse(responseText);
    }
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    // Don't throw here - we might have a 204 with no content
  }

  // Return a basic object with the IDs if we don't get anything back
  if (Object.keys(result).length === 0) {
    return {
      id: assessmentId,
      userId: userId,
      assessmentData: updateData
    };
  }

  return result;
}

/**
 * Delete an assessment
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} userId - User ID
 * @param {string} assessmentId - Assessment ID
 * @returns {Promise<boolean>} True if deleted successfully
 */
export async function deleteAssessment(request, token, userId, assessmentId) {
  // The correct URL format includes both userId and assessmentId
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

  return response.status() === 200;
}

/**
 * Generate default assessment data for testing
 * @returns {Object} Default assessment data
 */
export function generateDefaultAssessment() {
  return {
    age: "18-24",
    cycleLength: "26-30",
    periodDuration: "4-5",
    flowHeaviness: "moderate",
    painLevel: "moderate",
    symptoms: {
      physical: ["Bloating", "Headaches"],
      emotional: ["Mood swings", "Irritability"],
    },
  };
}

/**
 * Generate a more severe assessment profile
 * @returns {Object} Severe assessment data
 */
export function generateSevereAssessment() {
  return {
    age: "18-24",
    cycleLength: "31-35",
    periodDuration: "6-7",
    flowHeaviness: "heavy",
    painLevel: "severe",
    symptoms: {
      physical: ["Severe Cramps", "Nausea", "Vomiting", "Dizziness"],
      emotional: ["Depression", "Anxiety", "Mood swings", "Irritability"],
    },
  };
}
