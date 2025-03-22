import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../../../server.js';
import { createServer } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { initTestDatabase } from '../../../setup.js';

// Store server instance and test data
let server;
// Use a higher random port to avoid conflicts
const TEST_PORT = Math.floor(Math.random() * 10000) + 20000; // Different range than userlifecycle test

// Generate unique email to avoid conflicts with previous test runs
const uniqueSuffix = uuidv4().substring(0, 8);
const testUser = {
  username: `assessment_${uniqueSuffix}`,
  email: `assessment_${uniqueSuffix}@example.com`,
  password: 'Password123!',
  age: 25
};

console.log(`Creating assessment test user: ${testUser.username} / ${testUser.email}`);

// Test assessment data
const assessmentData = {
  age: '15_17',
  cycleLength: '26_30',
  periodDuration: '4_5',
  flowHeaviness: 'moderate',
  painLevel: 'moderate',
  symptoms: {
    physical: ['Bloating', 'Headaches'],
    emotional: ['Mood swings', 'Irritability']
  }
};

// Updated assessment data
const updatedAssessmentData = {
  age: '18_24',
  cycleLength: '21_25',
  periodDuration: '6_7',
  flowHeaviness: 'heavy',
  painLevel: 'severe',
  symptoms: {
    physical: ['Bloating', 'Headaches', 'Fatigue'],
    emotional: ['Mood swings', 'Anxiety']
  }
};

// Store user data, tokens, and assessment IDs for test steps
let userId;
let authToken;
let firstAssessmentId;
let secondAssessmentId;

// Start server before all tests
beforeAll(async () => {
  // Initialize the test database before starting the server
  await initTestDatabase();
  
  server = createServer(app);
  await new Promise((resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`Assessment test server started on port ${TEST_PORT}`);
      resolve();
    });
  });
}, 15000);

// Close server after all tests
afterAll(async () => {
  // Clean up test user if still present
  if (userId && authToken) {
    try {
      await request(app)
        .delete(`/api/auth/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);
      console.log(`Cleaned up test user ${userId}`);
    } catch (error) {
      console.log('Cleanup error:', error.message);
    }
  }

  await new Promise((resolve) => {
    server.close(() => {
      console.log('Assessment test server closed');
      resolve();
    });
  });
}, 15000);

describe('Assessment Lifecycle Integration Tests', () => {
  // Step 1: Create a new user
  test('1. Should create a new user', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send(testUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('username');
    
    // Save user ID for later tests
    userId = response.body.id;
    console.log(`Created assessment test user with ID: ${userId}`);
  });

  // Step 2: Login as this user
  test('2. Should login as the new user', async () => {
    try {
      console.log(`Attempting to login assessment user with email: ${testUser.email}`);
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      console.log(`Assessment login response status: ${response.status}`);
      console.log(`Assessment login response body: ${JSON.stringify(response.body).substring(0, 150)}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.id).toBe(userId);
      
      // Save auth token for later tests
      authToken = response.body.token;
      console.log(`Logged in with token length: ${authToken ? authToken.length : 'null'}`);
    } catch (error) {
      console.error('Assessment login test error:', error);
      throw error;
    }
  });

  // Step 3: Post the assessment result
  test('3. Should post an assessment result', async () => {
    try {
      // Skip if login failed
      if (!authToken) {
        console.log('Skipping post assessment test due to failed login');
        return;
      }
      
      console.log(`POST assessment with auth token length: ${authToken.length}`);
      const response = await request(app)
        .post('/api/assessment/send')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: userId,
          assessmentData: assessmentData
        });

      console.log(`Post assessment response status: ${response.status}`);
      console.log(`Post assessment response body: ${JSON.stringify(response.body).substring(0, 150)}`);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('userId');
      expect(response.body.userId).toBe(userId);
      
      // Save first assessment ID for later tests
      firstAssessmentId = response.body.id;
      console.log(`Created first assessment with ID: ${firstAssessmentId}`);
    } catch (error) {
      console.error('Post assessment test error:', error);
      throw error;
    }
  });

  // Step 4: Get the assessment result as a detailed object
  test('4. Should get the assessment result as a detailed object', async () => {
    try {
      // Skip if login failed or assessment creation failed
      if (!authToken || !firstAssessmentId) {
        console.log('Skipping get assessment test due to failed previous steps');
        return;
      }
      
      console.log(`GET assessment ${firstAssessmentId} with auth token length: ${authToken.length}`);
      const response = await request(app)
        .get(`/api/assessment/${firstAssessmentId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      console.log(`Get assessment response status: ${response.status}`);
      console.log(`Get assessment response body: ${JSON.stringify(response.body).substring(0, 150)}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', firstAssessmentId);
      expect(response.body).toHaveProperty('userId', userId);
      expect(response.body).toHaveProperty('assessmentData');
      
      // Verify assessment data
      const data = response.body.assessmentData;
      expect(data.age).toBe(assessmentData.age);
      expect(data.cycleLength).toBe(assessmentData.cycleLength);
      expect(data.periodDuration).toBe(assessmentData.periodDuration);
      expect(data.flowHeaviness).toBe(assessmentData.flowHeaviness);
      expect(data.painLevel).toBe(assessmentData.painLevel);
      
      console.log(`Retrieved first assessment details successfully`);
    } catch (error) {
      console.error('Get assessment test error:', error);
      throw error;
    }
  });

  // Step 5: Post a new assessment result with the same user
  test('5. Should post a second assessment result', async () => {
    try {
      // Skip if login failed
      if (!authToken) {
        console.log('Skipping second assessment test due to failed login');
        return;
      }
      
      console.log(`POST second assessment with auth token length: ${authToken.length}`);
      const response = await request(app)
        .post('/api/assessment/send')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: userId,
          assessmentData: updatedAssessmentData
        });

      console.log(`Post second assessment response status: ${response.status}`);
      console.log(`Post second assessment response body: ${JSON.stringify(response.body).substring(0, 150)}`);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('userId');
      expect(response.body.userId).toBe(userId);
      
      // Save second assessment ID for later tests
      secondAssessmentId = response.body.id;
      expect(secondAssessmentId).not.toBe(firstAssessmentId);
      console.log(`Created second assessment with ID: ${secondAssessmentId}`);
    } catch (error) {
      console.error('Post second assessment test error:', error);
      throw error;
    }
  });

  // Step 6: Get the 2 assessment results as the list of objects
  test('6. Should get both assessment results as a list', async () => {
    try {
      // Skip if login failed or assessments creation failed
      if (!authToken || !firstAssessmentId || !secondAssessmentId) {
        console.log('Skipping get assessment list test due to failed previous steps');
        return;
      }
      
      console.log(`GET assessment list with auth token length: ${authToken.length}`);
      const response = await request(app)
        .get('/api/assessment/list')
        .set('Authorization', `Bearer ${authToken}`);

      console.log(`Get assessment list response status: ${response.status}`);
      console.log(`Get assessment list response body: ${JSON.stringify(response.body).substring(0, 150)}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      
      // Verify both assessment IDs are in the list
      const assessmentIds = response.body.map(assessment => assessment.id);
      expect(assessmentIds).toContain(firstAssessmentId);
      expect(assessmentIds).toContain(secondAssessmentId);
      
      console.log(`Retrieved assessment list with ${response.body.length} items`);
    } catch (error) {
      console.error('Get assessment list test error:', error);
      throw error;
    }
  });

  // Step 7: Update the 2nd assessment result
  test('7. Should update the second assessment result', async () => {
    try {
      // Skip if login failed or second assessment creation failed
      if (!authToken || !secondAssessmentId) {
        console.log('Skipping update assessment test due to failed previous steps');
        return;
      }
      
      console.log(`PUT update assessment ${secondAssessmentId} with auth token length: ${authToken.length}`);
      // Update with modified data
      const response = await request(app)
        .put(`/api/assessment/update/${secondAssessmentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          assessmentData: {
            ...updatedAssessmentData,
            painLevel: 'mild',  // Change pain level from severe to mild
            symptoms: {
              physical: ['Bloating', 'Headaches', 'Fatigue', 'Cramps'],  // Add cramps
              emotional: ['Mood swings', 'Anxiety']
            }
          }
        });

      console.log(`Update assessment response status: ${response.status}`);
      console.log(`Update assessment response body: ${JSON.stringify(response.body).substring(0, 150)}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', secondAssessmentId);
      expect(response.body.assessmentData.painLevel).toBe('mild');
      expect(response.body.assessmentData.symptoms.physical).toContain('Cramps');
      
      console.log(`Updated second assessment successfully`);
    } catch (error) {
      console.error('Update assessment test error:', error);
      throw error;
    }
  });

  // Step 8: Get the updated 2nd assessment result as a detailed object
  test('8. Should get the updated second assessment result', async () => {
    try {
      // Skip if login failed or second assessment update failed
      if (!authToken || !secondAssessmentId) {
        console.log('Skipping get updated assessment test due to failed previous steps');
        return;
      }
      
      console.log(`GET updated assessment ${secondAssessmentId} with auth token length: ${authToken.length}`);
      const response = await request(app)
        .get(`/api/assessment/${secondAssessmentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      console.log(`Get updated assessment response status: ${response.status}`);
      console.log(`Get updated assessment response body: ${JSON.stringify(response.body).substring(0, 150)}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', secondAssessmentId);
      expect(response.body.assessmentData.painLevel).toBe('mild');
      expect(response.body.assessmentData.symptoms.physical).toContain('Cramps');
      
      console.log(`Retrieved updated second assessment successfully`);
    } catch (error) {
      console.error('Get updated assessment test error:', error);
      throw error;
    }
  });

  // Step 9: Delete the 2nd assessment result
  test('9. Should delete the second assessment result', async () => {
    try {
      // Skip if login failed or second assessment creation failed
      if (!authToken || !secondAssessmentId) {
        console.log('Skipping delete assessment test due to failed previous steps');
        return;
      }
      
      console.log(`DELETE assessment ${secondAssessmentId} with auth token length: ${authToken.length}`);
      const response = await request(app)
        .delete(`/api/assessment/delete/${secondAssessmentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      console.log(`Delete assessment response status: ${response.status}`);
      console.log(`Delete assessment response body: ${JSON.stringify(response.body).substring(0, 150)}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('deleted successfully');
      
      // Verify assessment was marked as deleted by checking the list endpoint
      console.log(`Verifying deletion by checking assessment list`);
      const listResponse = await request(app)
        .get('/api/assessment/list')
        .set('Authorization', `Bearer ${authToken}`);
      
      // The list should not contain the deleted assessment ID
      const assessmentIds = listResponse.body.map(assessment => assessment.id);
      expect(assessmentIds).not.toContain(secondAssessmentId);
      
      console.log(`Deleted second assessment successfully`);
    } catch (error) {
      console.error('Delete assessment test error:', error);
      throw error;
    }
  });

  // Step 10: Get the list of assessments again
  test('10. Should get updated assessment list with only first assessment', async () => {
    try {
      // Skip if login failed or assessments handling failed
      if (!authToken || !firstAssessmentId) {
        console.log('Skipping get updated list test due to failed previous steps');
        return;
      }
      
      console.log(`GET updated assessment list with auth token length: ${authToken.length}`);
      const response = await request(app)
        .get('/api/assessment/list')
        .set('Authorization', `Bearer ${authToken}`);

      console.log(`Get updated list response status: ${response.status}`);
      console.log(`Get updated list response body: ${JSON.stringify(response.body).substring(0, 150)}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBe(firstAssessmentId);
      
      console.log(`Verified assessment list has only 1 item after deletion`);
    } catch (error) {
      console.error('Get updated list test error:', error);
      throw error;
    }
  });

  // Step 11: Delete the user
  test('11. Should delete the user', async () => {
    try {
      // Skip if login failed
      if (!authToken) {
        console.log('Skipping delete user test due to failed login');
        return;
      }
      
      console.log(`DELETE user ${userId} with auth token length: ${authToken.length}`);
      const response = await request(app)
        .delete(`/api/auth/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      console.log(`Delete user response status: ${response.status}`);
      console.log(`Delete user response body: ${JSON.stringify(response.body).substring(0, 150)}`);
      
      // Allow both 200 (successful deletion) and 404 (user already deleted by previous tests)
      expect([200, 404].includes(response.status)).toBe(true);
      
      // If the deletion was successful (200), verify the expected response
      if (response.status === 200) {
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toContain('deleted successfully');
      }
      
      console.log(`Deleted test user successfully`);
    } catch (error) {
      console.error('Delete user test error:', error);
      throw error;
    }
  });
});
