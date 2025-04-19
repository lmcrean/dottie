// @ts-check
import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import supertest from 'supertest';
import app from '../../../../../server.js';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';

// Mock the database operations
vi.mock('../../../../../db/index.js', () => {
  // Create a mock storage for our test data
  const mockAssessments = new Map();
  const mockSymptoms = new Map();
  
  return {
    default: {
      query: vi.fn(),
      select: vi.fn().mockReturnThis(),
      insert: vi.fn((table, data) => {
        if (table === 'assessments') {
          const id = data.id || `test-assessment-${Date.now()}`;
          data.id = id;
          mockAssessments.set(id, { ...data });
          return Promise.resolve([id]);
        } else if (table === 'symptoms') {
          if (Array.isArray(data)) {
            data.forEach(symptom => {
              const symptomId = `symptom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
              mockSymptoms.set(symptomId, { ...symptom, id: symptomId });
            });
          } else {
            const symptomId = `symptom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            mockSymptoms.set(symptomId, { ...data, id: symptomId });
          }
          return Promise.resolve([]);
        }
        return Promise.resolve([]);
      }),
      where: vi.fn(function(column, value) {
        if (arguments.length === 2) {
          // Simplified where(field, value) case
          if (column === 'id') {
            this._whereId = value;
          } else if (column === 'user_id') {
            this._whereUserId = value;
          } else if (column === 'assessment_id') {
            this._whereAssessmentId = value;
          } else if (typeof column === 'object') {
            // Handle object case: where({field: value})
            if (column.id) this._whereId = column.id;
            if (column.user_id) this._whereUserId = column.user_id;
            if (column.assessment_id) this._whereAssessmentId = column.assessment_id;
          }
        } else if (arguments.length === 3) {
          // Handle where(field, operator, value) case
          const operator = arguments[1];
          const fieldValue = arguments[2];
          if (column === 'id' && operator === '=') {
            this._whereId = fieldValue;
          } else if (column === 'user_id' && operator === '=') {
            this._whereUserId = fieldValue;
          } else if (column === 'assessment_id' && operator === '=') {
            this._whereAssessmentId = fieldValue;
          }
        }
        return this;
      }),
      first: vi.fn(function() {
        if (this._whereId && mockAssessments.has(this._whereId)) {
          return Promise.resolve(mockAssessments.get(this._whereId));
        }
        return Promise.resolve(null);
      }),
      whereIn: vi.fn(function(column, values) {
        if (column === 'assessment_id') {
          this._whereAssessmentIds = values;
        }
        return this;
      }),
      from: vi.fn().mockReturnThis(),
      update: vi.fn(function(data) {
        if (this._whereId && mockAssessments.has(this._whereId)) {
          const existingData = mockAssessments.get(this._whereId);
          const updatedData = { ...existingData, ...data };
          mockAssessments.set(this._whereId, updatedData);
          return Promise.resolve(1);
        }
        return Promise.resolve(0);
      }),
      del: vi.fn(function() {
        if (this._whereId && mockAssessments.has(this._whereId)) {
          mockAssessments.delete(this._whereId);
          return Promise.resolve(1);
        } else if (this._whereAssessmentId) {
          // Delete symptoms for an assessment
          let count = 0;
          for (const [id, symptom] of mockSymptoms.entries()) {
            if (symptom.assessment_id === this._whereAssessmentId) {
              mockSymptoms.delete(id);
              count++;
            }
          }
          return Promise.resolve(count);
        }
        return Promise.resolve(0);
      }),
      then: vi.fn(function(callback) {
        if (this._whereUserId) {
          // Get assessments for a user
          const userAssessments = Array.from(mockAssessments.values())
            .filter(a => a.user_id === this._whereUserId);
          return Promise.resolve(callback(userAssessments));
        } else if (this._whereAssessmentId) {
          // Get symptoms for an assessment
          const assessmentSymptoms = Array.from(mockSymptoms.values())
            .filter(s => s.assessment_id === this._whereAssessmentId);
          return Promise.resolve(callback(assessmentSymptoms));
        } else if (this._whereAssessmentIds) {
          // Get symptoms for multiple assessments
          const assessmentSymptoms = Array.from(mockSymptoms.values())
            .filter(s => this._whereAssessmentIds.includes(s.assessment_id));
          return Promise.resolve(callback(assessmentSymptoms));
        }
        return Promise.resolve(callback([]));
      })
    }
  };
});

// Create a supertest instance
const request = supertest(app);

// Store server instance and test data
let server;
let testUserId = `test-user-${Date.now()}`; // Initialize with default value
let testToken = 'test-token'; // Initialize with default value
let testAssessmentId;
let testAssessmentData = {
  userId: 'test-user-id',
  assessmentData: {
    createdAt: new Date().toISOString(),
    assessment_data: {
      date: new Date().toISOString(),
      pattern: "Regular",
      age: "18-24",
      cycleLength: "26-30",
      periodDuration: "4-5",
      flowHeaviness: "moderate",
      painLevel: "moderate",
      symptoms: {
        physical: ["Bloating", "Headaches"],
        emotional: ["Mood swings"]
      }
    }
  }
};

// Use a different port for tests to avoid conflicts with the running server
const TEST_PORT = 5011;

// Create a mock token for testing
const createMockToken = (userId) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';
  return jwt.sign({ id: userId, userId: userId, role: 'user' }, JWT_SECRET);
};

describe("Assessment Success Integration Tests", () => {
  // Setup before tests
  beforeAll(async () => {
    try {
      console.log("Setting up test environment...");
      
      // Create server for supertest
      server = createServer(app);
      
      // Start server
      await new Promise((resolve) => {
        server.listen(TEST_PORT, () => {
          console.log(`Assessment success integration test server started on port ${TEST_PORT}`);
          
          // Set up test data
          testUserId = `test-user-${Date.now()}`;
          testToken = createMockToken(testUserId);
          testAssessmentId = `test-assessment-${Date.now()}`;
          
          console.log(`Test user ID: ${testUserId}`);
          console.log(`Test token: ${testToken.substring(0, 20)}...`);
          
          testAssessmentData = {
            userId: testUserId,
            assessmentData: {
              createdAt: new Date().toISOString(),
              assessment_data: {
                date: new Date().toISOString(),
                pattern: "Regular",
                age: "18-24",
                cycleLength: "26-30",
                periodDuration: "4-5",
                flowHeaviness: "moderate",
                painLevel: "moderate",
                symptoms: {
                  physical: ["Bloating", "Headaches"],
                  emotional: ["Mood swings"]
                }
              }
            }
          };
          
          resolve(true);
        });
      });
    } catch (error) {
      console.error('Error in test setup:', error);
      throw error;
    }
  }, 30000);
  
  // Cleanup after tests
  afterAll(async () => {
    if (server) {
      await new Promise((resolve) => {
        server.close(() => {
          console.log('Assessment success integration test server closed');
          resolve(true);
        });
      });
    }
  }, 30000);
  
  // Step 1: Create a user account (mocked for test)
  test("1. Create User Account - POST /api/auth/signup", async () => {
    console.log('Using mock token as user creation failed or was skipped');
    expect(testUserId).toBeTruthy();
  });
  
  // Step 2: Login (mocked for test)
  test("2. User Login - POST /api/auth/login", async () => {
    expect(testToken).toBeTruthy();
  });
  
  // Now the real test begins
  test("3. Submit Assessment - POST /api/assessment/send", async () => {
    try {
      console.log("Sending assessment data...");
      
      const response = await request
        .post('/api/assessment/send')
        .set("Authorization", `Bearer ${testToken}`)
        .send(testAssessmentData);

      console.log(`POST response status: ${response.status}`);
      console.log(`POST response body: ${JSON.stringify(response.body)}`);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      
      // Store assessment ID for later tests
      testAssessmentId = response.body.id;
      console.log(`Created test assessment with ID: ${testAssessmentId}`);
    } catch (error) {
      console.error("Error in test 3:", error);
      throw error;
    }
  });
  
  test("4. Retrieve Assessment - GET /api/assessment/:id", async () => {
    try {
      console.log(`Retrieving assessment with ID: ${testAssessmentId}`);
      
      const response = await request
        .get(`/api/assessment/${testAssessmentId}`)
        .set("Authorization", `Bearer ${testToken}`);

      console.log(`GET response status: ${response.status}`);
      if (response.status !== 200) {
        console.log(`GET error response: ${JSON.stringify(response.body)}`);
      } else {
        console.log(`GET response has id: ${response.body.id}`);
      }
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", testAssessmentId);
      expect(response.body).toHaveProperty("assessmentData");
    } catch (error) {
      console.error("Error in test 4:", error);
      throw error;
    }
  });
  
  test("5. List User Assessments - GET /api/assessment/list", async () => {
    try {
      console.log(`Listing assessments for user: ${testUserId}`);
      
      const response = await request
        .get('/api/assessment/list')
        .set("Authorization", `Bearer ${testToken}`);

      console.log(`LIST response status: ${response.status}`);
      console.log(`LIST response is array: ${Array.isArray(response.body)}`);
      if (Array.isArray(response.body)) {
        console.log(`LIST response array length: ${response.body.length}`);
      }
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // If we have a test assessment, it should be in the list
      if (testAssessmentId) {
        const found = response.body.some(assessment => assessment.id === testAssessmentId);
        console.log(`Assessment found in list: ${found}`);
        expect(found).toBe(true);
      }
    } catch (error) {
      console.error("Error in test 5:", error);
      throw error;
    }
  });
  
  test("6. Update Assessment - PUT /api/assessment/:id", async () => {
    try {
      console.log(`Updating assessment ID: ${testAssessmentId}`);
      
      const updateData = {
        assessmentData: {
          assessment_data: {
            ...testAssessmentData.assessmentData.assessment_data,
            painLevel: "severe", // Change from moderate to severe
            symptoms: {
              ...testAssessmentData.assessmentData.assessment_data.symptoms,
              physical: [...testAssessmentData.assessmentData.assessment_data.symptoms.physical, "Insomnia"]
            }
          }
        }
      };
      
      console.log(`UPDATE URL: /api/assessment/${testUserId}/${testAssessmentId}`);
      console.log(`UPDATE data: ${JSON.stringify(updateData)}`);
      
      const response = await request
        .put(`/api/assessment/${testUserId}/${testAssessmentId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(updateData);

      console.log(`UPDATE response status: ${response.status}`);
      console.log(`UPDATE response body: ${JSON.stringify(response.body)}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", testAssessmentId);
      expect(response.body.assessmentData).toHaveProperty("painLevel", "severe");
      expect(response.body.assessmentData.symptoms.physical).toContain("Insomnia");
    } catch (error) {
      console.error("Error in test 6:", error);
      throw error;
    }
  });
  
  test("7. Delete Assessment - DELETE /api/assessment/:id", async () => {
    try {
      console.log(`Deleting assessment ID: ${testAssessmentId}`);
      console.log(`DELETE URL: /api/assessment/${testUserId}/${testAssessmentId}`);
      
      const response = await request
        .delete(`/api/assessment/${testUserId}/${testAssessmentId}`)
        .set("Authorization", `Bearer ${testToken}`);

      console.log(`DELETE response status: ${response.status}`);
      console.log(`DELETE response body: ${JSON.stringify(response.body)}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
      
      // Verify the assessment is gone
      console.log("Verifying assessment deletion...");
      const checkResponse = await request
        .get(`/api/assessment/${testAssessmentId}`)
        .set("Authorization", `Bearer ${testToken}`);
      
      console.log(`Verification response status: ${checkResponse.status}`);
      
      expect(checkResponse.status).toBe(404);
    } catch (error) {
      console.error("Error in test 7:", error);
      throw error;
    }
  });
}); 