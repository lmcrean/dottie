// @ts-check
import { describe, test, expect } from 'vitest';
import supertest from 'supertest';
import app from '../../../../../server.js';
import jwt from 'jsonwebtoken';

// Create a supertest instance
export const request = supertest(app);

// Sample assessment data for testing
export const sampleAssessmentData = {
  userId: null, // Will be set during test setup
  assessmentData: {
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
};

// Create a mock token for testing
export const createMockToken = (userId) => {
  return jwt.sign(
    { id: userId, email: `test_${Date.now()}@example.com` },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1h' }
  );
};

// Helper function for assessment list requests
export const getAssessmentList = async (token) => {
  return await request
    .get("/api/assessment/list")
    .set("Authorization", `Bearer ${token}`);
};

// Helper function for assessment submission
export const submitAssessment = async (data, token) => {
  return await request
    .post("/api/assessment/send")
    .set("Authorization", `Bearer ${token}`)
    .send(data);
}; 