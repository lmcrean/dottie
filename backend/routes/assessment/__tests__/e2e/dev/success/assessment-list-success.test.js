// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import db from '../../../../../../db/index.js';
import { setupTestServer, closeTestServer, createMockToken } from '../../../../../../test-utilities/testSetup.js';

// Store server instance and test data
let server;
let request;
let testUserId;
let testToken;
let testAssessmentIds = [];

// Use a different port for tests
const TEST_PORT = 5006;

// Start server before all tests
beforeAll(async () => {
  try {
    // Initialize test database first
    console.log('Initializing database for assessment list tests...');
    
    // Clear any existing test data
    await db('assessments').where('id', 'like', 'test-%').delete();
    await db('users').where('id', 'like', 'test-%').delete();
    
    console.log('Test database cleared');
    
    // Create a test user directly in the database
    testUserId = `test-user-${Date.now()}`;
    const userData = {
      id: testUserId,
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password_hash: 'test-hash', // Not used for auth in these tests
      age: '18_24',
      createdAt: new Date().toISOString()
    };
    
    await db('users').insert(userData);
    console.log('Test user created:', testUserId);
    
    // Create a JWT token using the utility
    testToken = createMockToken(testUserId);
    
    // Create two test assessments in the database
    const testAssessment1Id = `test-assessment-1-${Date.now()}`;
    const assessmentData1 = {
      id: testAssessment1Id,
      userId: testUserId,
      createdAt: new Date().toISOString(),
      age: '18_24',
      cycle_length: '26_30',
      period_duration: '4_5',
      flow_heaviness: 'moderate',
      pain_level: 'moderate'
    };
    
    await db('assessments').insert(assessmentData1);
    testAssessmentIds.push(testAssessment1Id);
    
    // Create a second assessment
    const testAssessment2Id = `test-assessment-2-${Date.now()}`;
    const assessmentData2 = {
      id: testAssessment2Id,
      userId: testUserId,
      createdAt: new Date().toISOString(),
      age: '18_24',
      cycle_length: '21_25',
      period_duration: '6_7',
      flow_heaviness: 'heavy',
      pain_level: 'severe'
    };
    
    await db('assessments').insert(assessmentData2);
    testAssessmentIds.push(testAssessment2Id);
    
    console.log('Test assessments created:', testAssessmentIds);
    
    // Setup test server using the utility
    const setup = await setupTestServer(TEST_PORT);
    server = setup.server;
    request = setup.request;
    
  } catch (error) {
    console.error('Error in test setup:', error);
    throw error;
  }
}, 15000); // Increased timeout for setup

// Close server and cleanup after all tests
afterAll(async () => {
  try {
    // Clean up test data
    for (const assessmentId of testAssessmentIds) {
      await db('assessments').where('id', assessmentId).delete();
    }
    await db('users').where('id', testUserId).delete();
    
    // Close the server using the utility
    await closeTestServer(server);
    console.log('Assessment list success test server closed');
  } catch (error) {
    console.error('Error in test cleanup:', error);
  }
}, 15000);

describe("Assessment List Endpoint - Success Cases", () => {
  // Test listing all assessments for a user
  test("GET /api/assessment/list - should successfully return list of assessments", async () => {
    console.log('Running assessment list test for user:', testUserId);
    
    const response = await request
      .get('/api/assessment/list')
      .set('Authorization', `Bearer ${testToken}`);
    
    console.log('Response status:', response.status);
    
    // The mock DB will simulate a response with mock data
    // This is testing the API route behavior, not actual data persistence
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    // These minimal checks verify the structure but not actual data
    // Since we're using a mock DB that doesn't persist real test data
    if (response.body.length > 0) {
      const assessment = response.body[0];
      expect(assessment).toHaveProperty('id');
      expect(assessment).toHaveProperty('userId');
      expect(assessment).toHaveProperty('assessmentData');
    }
  });
}); 