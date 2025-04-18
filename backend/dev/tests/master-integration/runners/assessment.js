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
export async function createAssessment(request, token, userId, assessmentData = null) {
  console.log('Creating assessment for user:', userId);
  
  // If no assessment data provided, use default test data
  const data = assessmentData || generateDefaultAssessment();
  
  const payload = {
    userId: userId,
    assessmentData: data
  };
  
  console.log('Assessment payload:', payload);
  
  const response = await request.post('/api/assessment/send', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: payload
  });
  
  const result = await response.json();
  console.log('Create assessment response:', result);
  
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
  console.log('Getting all assessments');
  
  const response = await request.get('/api/assessment/list', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  console.log('Get assessments response:', result);
  
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
  console.log('Getting assessment by ID:', assessmentId);
  
  const response = await request.get(`/api/assessment/${assessmentId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  console.log('Get assessment by ID response:', result);
  
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
export async function updateAssessment(request, token, userId, assessmentId, updateData) {
  console.log('Updating assessment:', assessmentId, 'for user:', userId);
  console.log('Update data:', updateData);
  
  // The API might expect the full assessment structure with the updated data
  const payload = {
    assessmentData: updateData
  };
  
  // The correct URL format includes both userId and assessmentId
  const response = await request.put(`/api/assessment/${userId}/${assessmentId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: payload
  });
  
  // Log the response status and body for debugging
  console.log('Update assessment status:', response.status());
  let responseText;
  try {
    responseText = await response.text();
    console.log('Update assessment response text:', responseText);
  } catch (error) {
    console.error('Failed to get response text:', error);
  }
  
  if (response.status() !== 200) {
    throw new Error(`Failed to update assessment: ${response.status()}`);
  }
  
  let result;
  try {
    // Try to parse as JSON only if we haven't already
    if (responseText && !result) {
      result = JSON.parse(responseText);
    } else {
      result = await response.json();
    }
    console.log('Update assessment parsed response:', result);
  } catch (error) {
    console.error('Failed to parse JSON response:', error);
    throw new Error(`Failed to parse update response: ${error.message}`);
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
  console.log('Deleting assessment:', assessmentId, 'for user:', userId);
  
  // The correct URL format includes both userId and assessmentId
  const response = await request.delete(`/api/assessment/${userId}/${assessmentId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  console.log('Delete assessment status:', response.status());
  
  // Log the response for debugging
  try {
    const responseText = await response.text();
    console.log('Delete assessment response:', responseText);
  } catch (error) {
    console.error('Failed to get delete response text:', error);
  }
  
  return response.status() === 200;
}

/**
 * Generate default assessment data for testing
 * @returns {Object} Default assessment data
 */
export function generateDefaultAssessment() {
  return {
    age: '25-34',
    cycleLength: '26-30',
    periodDuration: '4-5',
    flowHeaviness: 'moderate',
    painLevel: 'moderate',
    symptoms: {
      physical: ['Bloating', 'Headaches'],
      emotional: ['Mood swings', 'Irritability']
    }
  };
}

/**
 * Generate a more severe assessment profile
 * @returns {Object} Severe assessment data
 */
export function generateSevereAssessment() {
  return {
    age: '25-34',
    cycleLength: '21-25',
    periodDuration: '6-7',
    flowHeaviness: 'heavy',
    painLevel: 'severe',
    symptoms: {
      physical: ['Cramps', 'Headaches', 'Fatigue', 'Nausea'],
      emotional: ['Irritability', 'Anxiety', 'Depression']
    }
  };
} 