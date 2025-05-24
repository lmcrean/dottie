import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAssessmentDetail } from '../../../controller.js';
import Assessment from '../../../../../../models/assessment/Assessment.js';

// Mock the Assessment model
vi.mock('../../../../../../models/assessment/Assessment.js', () => {
  return {
    default: {
      findById: vi.fn(),
      validateOwnership: vi.fn()
    }
  };
});

describe('Get Assessment Detail Controller - Success Case', () => {
  // Mock request and response
  let req;
  let res;
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Setup request with authentication and params
    req = {
      user: {
        userId: 'test-user-123'
      },
      params: {
        assessmentId: 'test-assessment-123'
      }
    };
    
    // Setup response with jest spies
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    };
    
    // Mock successful ownership validation
    Assessment.validateOwnership.mockResolvedValue(true);
    
    // Mock successful assessment retrieval
    const mockAssessment = {
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
    
    Assessment.findById.mockResolvedValue(mockAssessment);
  });
  
  it('should retrieve assessment details successfully', async () => {
    // Call the controller
    await getAssessmentDetail(req, res);
    
    // Verify ownership validation was called
    expect(Assessment.validateOwnership).toHaveBeenCalledWith(
      req.params.assessmentId,
      req.user.userId
    );
    
    // Verify Assessment.findById was called with the right params
    expect(Assessment.findById).toHaveBeenCalledWith(
      req.params.assessmentId
    );
    
    // Verify response
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      id: 'test-assessment-123',
      user_id: 'test-user-123'
    }));
  });
}); 