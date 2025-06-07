import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listAssessments } from '../../../controller.js';
import Assessment from '../../../../../../models/assessment/Assessment.js';

// Mock the Assessment model
vi.mock('../../../../../../models/assessment/Assessment.js', () => {
  return {
    default: {
      listByUser: vi.fn()
    }
  };
});

describe('List Assessments Controller - Success Case', () => {
  // Mock request and response
  let req;
  let res;
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Setup request with authentication
    req = {
      user: {
        userId: 'test-user-123'
      }
    };
    
    // Setup response with jest spies
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    };
    
    // Mock successful assessments list retrieval
    const mockAssessments = [
      {
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
      },
      {
        id: 'test-assessment-456',
        user_id: 'test-user-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        age: "35-44",
        pattern: "irregular",
        cycle_length: "31-35",
        period_duration: "6-7",
        flow_heaviness: "heavy",
        pain_level: "severe",
        physical_symptoms: ["Cramps", "Fatigue"],
        emotional_symptoms: ["Anxiety", "Depression"],
        recommendations: [
          {
            title: "Recommendation 3",
            description: "Description for recommendation 3"
          },
          {
            title: "Recommendation 4",
            description: "Description for recommendation 4"
          }
        ]
      }
    ];
    
    Assessment.listByUser.mockResolvedValue(mockAssessments);
  });
  
  it('should list all assessments for a user successfully', async () => {
    // Call the controller
    await listAssessments(req, res);
    
    // Verify Assessment.listByUser was called with the right params
    expect(Assessment.listByUser).toHaveBeenCalledWith(
      req.user.userId
    );
    
    // Verify response
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(String),
        user_id: req.user.userId
      })
    ]));
  });
}); 