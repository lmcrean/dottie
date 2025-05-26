import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteAssessment } from '../../../controller.js';
import Assessment from '../../../../../../models/assessment/Assessment.js';

// Mock the Assessment model
vi.mock('../../../../../../models/assessment/Assessment.js', () => {
  return {
    default: {
      delete: vi.fn(),
      validateOwnership: vi.fn()
    }
  };
});

describe('Delete Assessment Controller - Success Case', () => {
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
    
    // Mock successful assessment deletion
    Assessment.delete.mockResolvedValue(true);
  });
  
  it('should delete an assessment successfully', async () => {
    // Call the controller
    await deleteAssessment(req, res);
    
    // Verify ownership validation was called
    expect(Assessment.validateOwnership).toHaveBeenCalledWith(
      req.params.assessmentId,
      req.user.userId
    );
    
    // Verify Assessment.delete was called with the right params
    expect(Assessment.delete).toHaveBeenCalledWith(
      req.params.assessmentId
    );
    
    // Verify response
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Assessment deleted successfully' });
  });
}); 