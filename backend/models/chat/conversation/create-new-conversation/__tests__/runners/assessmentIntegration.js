import { describe, it, expect } from 'vitest';
import { createAssessmentConversation } from '../../createFlow.js';
import DbService from '@/services/dbService.js';

/**
 * Tests for assessment data integration scenarios
 */
export const runAssessmentIntegrationTests = (mockData) => {
  const { mockUserId, mockConversationId, mockInitialMessage, mockAssessmentObject } = mockData;

  describe('Assessment data integration', () => {
    it('should work with various assessment patterns', async () => {
      const patterns = ['regular', 'irregular', 'heavy', 'pain', 'developing'];
      
      for (const pattern of patterns) {
        const assessmentWithPattern = {
          ...mockAssessmentObject,
          pattern,
          id: `assessment-${pattern}`
        };
        
        DbService.findById.mockResolvedValue(assessmentWithPattern);
        
        const { createConversation } = await import('../../../../chat-detail/shared/database/chatCreate.js');
        createConversation.mockResolvedValue(`conv-${pattern}`);
        
        const { createInitialMessage } = await import('../../../../message/user-message/add-message/create-initial-message/createInitialMessage.js');
        createInitialMessage.mockResolvedValue(mockInitialMessage);
        
        const result = await createAssessmentConversation(mockUserId, assessmentWithPattern.id);
        
        expect(result.conversationId).toBe(`conv-${pattern}`);
        expect(result.assessmentId).toBe(assessmentWithPattern.id);
      }
    });

    it('should handle complex assessment objects with all symptoms', async () => {
      const complexAssessment = {
        ...mockAssessmentObject,
        physical_symptoms: [
          'bloating', 'fatigue', 'headaches', 'breast-tenderness', 
          'back-pain', 'nausea', 'dizziness'
        ],
        emotional_symptoms: [
          'mood-swings', 'anxiety', 'depression', 'irritability', 
          'crying-spells', 'social-withdrawal'
        ],
        other_symptoms: 'severe cramping, joint pain, insomnia',
        recommendations: [
          { title: 'Exercise', description: 'Regular cardio and strength training' },
          { title: 'Diet', description: 'Anti-inflammatory foods' },
          { title: 'Sleep', description: 'Maintain regular sleep schedule' },
          { title: 'Stress Management', description: 'Practice mindfulness and relaxation' }
        ]
      };
      
      DbService.findById.mockResolvedValue(complexAssessment);
      
      const { createConversation } = await import('../../../../chat-detail/shared/database/chatCreate.js');
      createConversation.mockResolvedValue(mockConversationId);
      
      const { createInitialMessage } = await import('../../../../message/user-message/add-message/create-initial-message/createInitialMessage.js');
      createInitialMessage.mockResolvedValue(mockInitialMessage);
      
      const result = await createAssessmentConversation(mockUserId, complexAssessment.id);
      
      expect(result.conversationId).toBe(mockConversationId);
      expect(result.assessmentId).toBe(complexAssessment.id);
      expect(result.initialMessage).toBeDefined();
    });

    it('should handle minimal assessment objects', async () => {
      const minimalAssessment = {
        id: 'minimal-assessment',
        user_id: mockUserId,
        pattern: 'regular',
        physical_symptoms: [],
        emotional_symptoms: [],
        recommendations: []
      };
      
      DbService.findById.mockResolvedValue(minimalAssessment);
      
      const { createConversation } = await import('../../../../chat-detail/shared/database/chatCreate.js');
      createConversation.mockResolvedValue(mockConversationId);
      
      const { createInitialMessage } = await import('../../../../message/user-message/add-message/create-initial-message/createInitialMessage.js');
      createInitialMessage.mockResolvedValue(mockInitialMessage);
      
      const result = await createAssessmentConversation(mockUserId, minimalAssessment.id);
      
      expect(result.conversationId).toBe(mockConversationId);
      expect(result.assessmentId).toBe(minimalAssessment.id);
    });
  });
}; 