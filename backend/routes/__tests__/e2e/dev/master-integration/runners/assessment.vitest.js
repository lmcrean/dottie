/**
 * Assessment Utilities for Integration Tests (Vitest/Supertest Version)
 *
 * This file contains helper functions for assessment-related operations using supertest.
 */

/**
 * Create a new assessment
 * @param {import('supertest').SuperTest<import('supertest').Test>} request - Supertest agent
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
  const data = assessmentData || generateDefaultAssessment();
  const flattenedData = {
    userId: userId,
    assessmentData: {
      age: data.age,
      cycle_length: data.cycleLength,
      period_duration: data.periodDuration,
      flow_heaviness: data.flowHeaviness,
      pain_level: data.painLevel,
      physical_symptoms: data.symptoms?.physical || [],
      emotional_symptoms: data.symptoms?.emotional || []
    }
  };

  console.log('Creating assessment payload:', JSON.stringify(flattenedData));
  console.log('Using auth token:', token?.substring(0, 20) + '...'); // Check if token exists

  // Use supertest: post(url).set(header, value).send(data)
  const response = await request.post("/api/assessment/send")
    .set('Authorization', `Bearer ${token}`)
    .send(flattenedData);

  console.log('Assessment creation status:', response.status);
  console.log('Assessment creation body:', JSON.stringify(response.body || response.text));

  if (response.status !== 201) {
    const error = new Error(`Failed to create assessment: ${response.status}`);
    error.response = response;
    throw error;
  }

  // Return ID from parsed body
  return response.body.id;
}

/**
 * Get all assessments for a user
 * @param {import('supertest').SuperTest<import('supertest').Test>} request - Supertest agent
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} List of assessments
 */
export async function getAssessments(request, token) {
  // Use supertest: get(url).set(header, value)
  const response = await request.get("/api/assessment/list")
    .set('Authorization', `Bearer ${token}`);

  console.log('Get assessments list status:', response.status);
  console.log('Assessments list body:', JSON.stringify(response.body).substring(0, 300) + '...');

  // If 404 (no assessments found), return empty array as per original logic
  if (response.status === 404) {
    console.log('No assessments found - returning empty array');
    return [];
  }

  if (response.status !== 200) {
    const error = new Error(`Failed to get assessments: ${response.status}`);
    error.response = response;
    throw error;
  }

  return response.body;
}

/**
 * Get a specific assessment by ID
 * @param {import('supertest').SuperTest<import('supertest').Test>} request - Supertest agent
 * @param {string} token - Authentication token
 * @param {string} assessmentId - Assessment ID
 * @returns {Promise<Object>} Assessment data
 */
export async function getAssessmentById(request, token, assessmentId) {
  // Use supertest: get(url).set(header, value)
  const response = await request.get(`/api/assessment/${assessmentId}`)
    .set('Authorization', `Bearer ${token}`);

  console.log(`Get assessment by ID ${assessmentId} - Status: ${response.status}`);
  console.log(`Get assessment body: ${JSON.stringify(response.body)}`);

  // Check for non-200 status BEFORE returning body
  if (response.status !== 200) {
    const error = new Error(`Failed to get assessment ${assessmentId}: ${response.status}`);
    error.response = response; // Attach response to error object
    throw error;
  }

  return response.body;
}

/**
 * Update an existing assessment
 * @param {import('supertest').SuperTest<import('supertest').Test>} request - Supertest agent
 * @param {string} token - Authentication token
 * @param {string} userId - User ID
 * @param {string} assessmentId - Assessment ID
 * @param {Object} updateData - Updated assessment data
 * @returns {Promise<Object>} Updated assessment
 */
export async function updateAssessment(
  request,
  token,
  userId, // Note: userId might not be needed if API uses token/assessmentId only
  assessmentId,
  updateData
) {
  const payload = {
    age: updateData.age || "18-24",
    cycle_length: updateData.cycleLength || updateData.cycle_length,
    period_duration: updateData.periodDuration || updateData.period_duration,
    flow_heaviness: updateData.flowHeaviness || updateData.flow_heaviness,
    pain_level: updateData.painLevel || updateData.pain_level,
    physical_symptoms: updateData.symptoms?.physical || updateData.physical_symptoms || [],
    emotional_symptoms: updateData.symptoms?.emotional || updateData.emotional_symptoms || []
  };

  console.log(`Updating assessment ${assessmentId}`); // Removed userId reference as it might be implicit
  console.log('Update payload:', JSON.stringify(payload));

  // Use supertest: put(url).set(header, value).send(data)
  const response = await request.put(`/api/assessment/${assessmentId}`)
    .set('Authorization', `Bearer ${token}`)
    .send(payload);

  console.log(`Update assessment status: ${response.status}`);
  console.log(`Update assessment body: ${JSON.stringify(response.body || response.text)}`);

  // Accept 200 or 204 (no content) as success
  if (response.status !== 200 && response.status !== 204) {
    const error = new Error(`Failed to update assessment: ${response.status}`);
    error.response = response;
    throw error;
  }

  // Return response body if it exists (status 200), otherwise return a constructed object for 204
  if (response.status === 200 && response.body) {
    return response.body;
  } else {
    // Construct object similar to original logic for 204 or empty 200
    return {
      id: assessmentId,
      // user_id might not be returned by API, handle potentially missing field
      // user_id: userId, // Removed as it might not be accurate
      ...payload
    };
  }
}

/**
 * Delete an assessment
 * @param {import('supertest').SuperTest<import('supertest').Test>} request - Supertest agent
 * @param {string} token - Authentication token
 * @param {string} userId - User ID
 * @param {string} assessmentId - Assessment ID
 * @returns {Promise<boolean>} True if deleted successfully
 */
export async function deleteAssessment(request, token, userId, assessmentId) {
  console.log(`Deleting assessment ${assessmentId} for user ${userId}`);

  // Use supertest: delete(url).set(header, value)
  const response = await request.delete(`/api/assessment/${userId}/${assessmentId}`)
    .set('Authorization', `Bearer ${token}`);

  console.log(`Delete assessment status: ${response.status}`);
  try {
    console.log(`Delete assessment response body: ${JSON.stringify(response.body || response.text)}`);
  } catch (error) {
    console.error("Error logging delete response body:", error);
  }

  // Check for successful status (200 OK or 204 No Content)
  const success = response.status === 200 || response.status === 204;
  if (!success) {
      // Optionally throw an error if deletion fails, depending on test needs
      // const error = new Error(`Failed to delete assessment ${assessmentId}: ${response.status}`);
      // error.response = response;
      // throw error;
      console.warn(`Failed to delete assessment ${assessmentId}: Status ${response.status}`);
  }
  return success;
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