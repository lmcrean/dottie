import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAssessment } from '../../../controller.js';
import Assessment from '../../../../../../models/assessment/Assessment.js';

// Mock the Assessment model
vi.mock('../../../../../../models/assessment/Assessment.js', () => {
  return {
    default: {
      create: vi.fn()
    }
  };
});

describe('Create Assessment Controller - Success Case', () => {
  // Mock request and response
  let req;
  let res;
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Setup request with authentication and body
    req = {
      user: {
        userId: 'test-user-123'
      },
      body: {
        assessmentData: {
          age: "25-34",
          pattern: "regular",
          cycle_length: "26-30",
          period_duration: "4-5", 
          flow_heaviness: "moderate",
          pain_level: "moderate",
          physical_symptoms: ["Bloating", "Headaches"],
          emotional_symptoms: ["Mood swings", "Irritability"],
          recommendations: [
            {
              title: "Recommendation 1",
              description: "Description for recommendation 1"
            },
            {
              title: "Recommendation 2",
              description: "Description for recommendation 2"
            }
          ]
        }
      }
    };
    
    // Setup response with jest spies
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    };
    
    // Mock successful assessment creation
    const mockCreatedAssessment = {
      id: 'test-assessment-123',
      user_id: 'test-user-123',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      age: "25-34",
      pattern: "regular",
      cycle_length: "26-30",
      period_duration: "4-5",
      flow_heaviness: "moderate",
      pain_level: "moderate",
      physical_symptoms: ["Bloating", "Headaches"],
      emotional_symptoms: ["Mood swings", "Irritability"],
      recommendations: [
        {
          title: "Recommendation 1",
          description: "Description for recommendation 1"
        },
        {
          title: "Recommendation 2",
          description: "Description for recommendation 2"
        }
      ]
    };
    
    Assessment.create.mockResolvedValue(mockCreatedAssessment);
  });
  
  it('should create a new assessment successfully', async () => {
    // Call the controller
    await createAssessment(req, res);
    
    // Verify Assessment.create was called with the right params
    expect(Assessment.create).toHaveBeenCalledWith(
      req.body.assessmentData,
      req.user.userId
    );
    
    // Verify response
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });
}); 