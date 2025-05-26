import { describe, it, expect, vi } from 'vitest';

// Mock logger
vi.mock('../../../../services/logger', () => ({
  default: {
    info: vi.fn()
  }
}));

import { getMockResponse, getMockAssessmentResponse } from '../mock-response/mockResponseService.js';

describe('Mock Response Service', () => {
  describe('General Mock Responses', () => {
    it('should return keyword-specific responses for pain-related messages', () => {
      const response = getMockResponse('I have severe pain during my period');
      
      expect(response).toContain('pain');
      expect(response).toContain('over-the-counter pain relievers');
      expect(response).toContain('*Note: This is a placeholder response for developers');
    });

    it('should return keyword-specific responses for flow-related messages', () => {
      const response = getMockResponse('My flow seems really heavy this month');
      
      expect(response).toContain('Flow varies from person to person');
      expect(response).toContain('*Note: This is a placeholder response for developers');
    });

    it('should return keyword-specific responses for late period messages', () => {
      const response = getMockResponse('My period is late this month');
      
      expect(response).toContain('factors can affect cycle length');
      expect(response).toContain('stress, exercise, weight changes');
      expect(response).toContain('*Note: This is a placeholder response for developers');
    });

    it('should return general response for non-keyword messages', () => {
      const response = getMockResponse('How are you today?');
      
      expect(response).toContain('*Note: This is a placeholder response for developers');
      // Should be one of the general responses
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(50);
    });
  });

  describe('Initial Message Responses', () => {
    it('should return assessment-specific response when assessment ID is provided', () => {
      const response = getMockResponse('Hello, I just completed my assessment', 'initial', 'assessment-123');
      
      expect(response).toContain('assessment');
      expect(response).toContain('*Note: This is a placeholder response for developers');
    });

    it('should return welcome response when no assessment ID is provided', () => {
      const response = getMockResponse('Hello, this is my first message', 'initial');
      
      expect(response).toContain('*Note: This is a placeholder response for developers');
      // Should contain welcoming language
      expect(response.toLowerCase()).toMatch(/hello|welcome|hi/);
    });
  });

  describe('Follow-up Message Responses', () => {
    it('should return follow-up specific responses', () => {
      const response = getMockResponse('Can you tell me more about that?', 'followup');
      
      expect(response).toContain('*Note: This is a placeholder response for developers');
      // Should contain language appropriate for continuing a conversation
      expect(response.toLowerCase()).toMatch(/sharing|details|appreciate|continue|share|insights/);
    });
  });

  describe('Assessment-specific Mock Responses', () => {
    it('should include pattern information in assessment responses', () => {
      const response = getMockAssessmentResponse('irregular', 'Tell me about my results');
      
      expect(response).toContain('irregular pattern');
      expect(response).toContain('assessment');
      expect(response).toContain('*Note: This is a placeholder response for developers');
    });

    it('should handle missing pattern gracefully', () => {
      const response = getMockAssessmentResponse(null, 'Tell me about my results');
      
      expect(response).toContain('unique pattern');
      expect(response).toContain('*Note: This is a placeholder response for developers');
    });
  });

  describe('Developer Notes', () => {
    it('should always include developer note in responses', () => {
      const generalResponse = getMockResponse('Any message');
      const initialResponse = getMockResponse('Hello', 'initial');
      const followupResponse = getMockResponse('More info?', 'followup');
      const assessmentResponse = getMockAssessmentResponse('regular', 'My results');

      expect(generalResponse).toContain('*Note: This is a placeholder response for developers');
      expect(initialResponse).toContain('*Note: This is a placeholder response for developers');
      expect(followupResponse).toContain('*Note: This is a placeholder response for developers');
      expect(assessmentResponse).toContain('*Note: This is a placeholder response for developers');
    });

    it('should mention that real API would provide personalized responses', () => {
      const response = getMockResponse('Test message');
      
      expect(response).toContain('personalized AI responses');
    });
  });

  describe('Response Quality', () => {
    it('should provide medically appropriate guidance even in mock mode', () => {
      const painResponse = getMockResponse('I have cramps');
      
      expect(painResponse.toLowerCase()).toContain('healthcare provider');
      expect(painResponse).not.toContain('diagnosis');
      expect(painResponse).not.toContain('prescrib');
    });

    it('should maintain supportive and professional tone', () => {
      const response = getMockResponse('I am worried about my cycle');
      
      expect(response).not.toContain('don\'t worry');
      expect(response).not.toContain('you\'re fine');
      // Should encourage professional consultation
      expect(response.toLowerCase()).toMatch(/healthcare|provider|doctor|medical/);
    });
  });
}); 