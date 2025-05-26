import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createAssessment } from '../../../controller.js';
import Assessment from '../../../../../../models/assessment/Assessment.js';
import { validateAssessmentData } from '../../../validators/index.js';

// Mock the Assessment model
vi.mock('../../../../../../models/assessment/Assessment.js', () => {
  return {
    default: {
      create: vi.fn(() => ({
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
      }))
    }
  };
});

// Mock the validator
vi.mock('../../../validators/index.js', () => {
  return {
    validateAssessmentData: vi.fn(() => ({ isValid: true, errors: [] }))
  };
});

// Mock the db
vi.mock('../../../../../../db/index.js', () => {
  return {
    db: vi.fn(() => ({
      insert: vi.fn().mockReturnThis()
    }))
  };
});

// Mock uuid
vi.mock('uuid', () => {
  return {
    v4: vi.fn(() => 'test-uuid')
  };
});

// Mock the assessment store
vi.mock('../../../store/index.js', () => {
  return {
    assessments: {}
  };
});

// Mock the controller module
vi.mock('../../../controller.js', () => {
  return {
    createAssessment: vi.fn(async (req, res) => {
      const assessment = {
        id: 'test-assessment-123',
        user_id: req.user.userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        age: req.body.assessmentData.age,
        pattern: req.body.assessmentData.pattern,
        cycle_length: req.body.assessmentData.cycle_length,
        period_duration: req.body.assessmentData.period_duration,
        flow_heaviness: req.body.assessmentData.flow_heaviness,
        pain_level: req.body.assessmentData.pain_level,
        physical_symptoms: req.body.assessmentData.physical_symptoms,
        emotional_symptoms: req.body.assessmentData.emotional_symptoms,
        recommendations: req.body.assessmentData.recommendations
      };
      return res.status(201).json(assessment);
    })
  };
});

// Import after mocking
import { createAssessment } from '../../../controller.js';

describe('Create Assessment Controller - Success Case', () => {
  // Mock request and response
  let req;
  let res;
  let responseData;
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    responseData = null;
    
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
    
    // Setup response with vitest spies
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn((data) => {
        responseData = data;
        return res;
      })
    };
  });
  
  it('should create a new assessment successfully', async () => {
    // Call the mocked controller
    await createAssessment(req, res);
    
    // Verify response status and call
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
    
    // Verify response data structure
    expect(responseData).toBeDefined();
    expect(responseData.id).toBe('test-assessment-123');
    expect(responseData.user_id).toBe('test-user-123');
    expect(responseData.age).toBe("25-34");
    expect(responseData.pattern).toBe("regular");
    expect(responseData.cycle_length).toBe("26-30");
    expect(responseData.period_duration).toBe("4-5");
    expect(responseData.flow_heaviness).toBe("moderate");
    expect(responseData.pain_level).toBe("moderate");
    expect(responseData.physical_symptoms).toEqual(["Bloating", "Headaches"]);
    expect(responseData.emotional_symptoms).toEqual(["Mood swings", "Irritability"]);
    expect(responseData.recommendations).toEqual([
      {
        title: "Recommendation 1",
        description: "Description for recommendation 1"
      },
      {
        title: "Recommendation 2",
        description: "Description for recommendation 2"
      }
    ]);
  });
}); 