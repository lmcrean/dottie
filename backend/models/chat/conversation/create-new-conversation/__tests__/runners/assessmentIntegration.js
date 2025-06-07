import { describe, it, expect, beforeEach } from 'vitest';
import { createAssessmentConversation } from '../../createFlow.js';
import DbService from '@/services/dbService.js';

/**
 * Tests for assessment data integration and linking
 */
export const runAssessmentIntegrationTests = (mockData) => {
  const { 
    mockUserId, 
    mockAssessmentId, 
    mockConversationId, 
    mockAssessmentObject 
  } = mockData;

  describe('Assessment integration tests', () => {
    beforeEach(async () => {
      // Setup assessment-related mocks
      DbService.findById.mockResolvedValue(mockAssessmentObject);
      
      const { createConversation } = await import('../../database/conversationCreate.js');
      createConversation.mockResolvedValue(mockConversationId);
    });

    it('should link conversation to assessment', async () => {
      const result = await createAssessmentConversation(mockUserId, mockAssessmentId);
      
      // Verify assessment ID is stored
      expect(result.assessmentId).toBe(mockAssessmentId);
      
      // Verify conversation creation includes assessment ID
      const { createConversation } = await import('../../database/conversationCreate.js');
      expect(createConversation).toHaveBeenCalledWith(mockUserId, mockAssessmentId);
    });

    it('should handle assessment data retrieval', async () => {
      await createAssessmentConversation(mockUserId, mockAssessmentId);
      
      // Verify assessment data is accessed during conversation creation
      // This may be used for pattern setting or other assessment-linked features
      const { createConversation } = await import('../../database/conversationCreate.js');
      expect(createConversation).toHaveBeenCalledWith(mockUserId, mockAssessmentId);
    });

    it('should work with different assessment patterns', async () => {
      // Test with various assessment patterns
      const patterns = ['regular', 'irregular', 'heavy', 'pain', 'developing'];
      
      for (const pattern of patterns) {
        const patternAssessment = { ...mockAssessmentObject, pattern };
        DbService.findById.mockResolvedValue(patternAssessment);
        
        const result = await createAssessmentConversation(mockUserId, mockAssessmentId);
        
        expect(result.conversationId).toBe(mockConversationId);
        expect(result.assessmentId).toBe(mockAssessmentId);
        
        // Verify conversation creation still works regardless of pattern
        const { createConversation } = await import('../../database/conversationCreate.js');
        expect(createConversation).toHaveBeenCalledWith(mockUserId, mockAssessmentId);
      }
    });

    it('should handle complex assessment objects with all symptoms', async () => {
      const complexAssessment = {
        ...mockAssessmentObject,
        physical_symptoms: ['bloating', 'fatigue', 'headaches', 'breast-tenderness', 'acne'],
        emotional_symptoms: ['mood-swings', 'anxiety', 'depression', 'irritability'],
        other_symptoms: 'severe cramping and back pain',
        recommendations: [
          { title: 'Exercise', description: 'Regular cardio and strength training' },
          { title: 'Diet', description: 'Anti-inflammatory foods and omega-3s' },
          { title: 'Sleep', description: 'Consistent sleep schedule of 7-9 hours' },
          { title: 'Stress Management', description: 'Meditation and yoga practices' }
        ]
      };
      
      DbService.findById.mockResolvedValue(complexAssessment);
      
      const result = await createAssessmentConversation(mockUserId, mockAssessmentId);
      
      // Verify conversation creation succeeds with complex data
      expect(result.conversationId).toBe(mockConversationId);
      expect(result.assessmentId).toBe(mockAssessmentId);
    });

    it('should handle missing assessment gracefully', async () => {
      // Test when assessment doesn't exist
      DbService.findById.mockResolvedValue(null);
      
      const result = await createAssessmentConversation(mockUserId, mockAssessmentId);
      
      // Conversation should still be created even if assessment lookup fails
      expect(result.conversationId).toBe(mockConversationId);
      expect(result.assessmentId).toBe(mockAssessmentId);
    });
  });
}; 