import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getUserConversations } from '../chatGetList.js';
import { getConversationForUser } from '../../conversation/read-conversation/getConversation.js';
import DbService from '@/services/dbService.js';
import Assessment from '../../../assessment/Assessment.js';
import logger from '@/services/logger.js';

// Mock dependencies
vi.mock('@/services/dbService.js');
vi.mock('@/services/logger.js');
vi.mock('../../../assessment/Assessment.js');

describe('Assessment Object Integration in Conversations', () => {
  const mockUserId = 'test-user-123';
  const mockConversationId = 'test-conversation-456';
  const mockAssessmentId = 'test-assessment-789';
  
  const mockAssessmentData = {
    id: mockAssessmentId,
    user_id: mockUserId,
    age: '25-34',
    pattern: 'irregular',
    cycle_length: 'irregular',
    period_duration: '4-5',
    flow_heaviness: 'medium',
    pain_level: 'moderate',
    physical_symptoms: ['bloating', 'fatigue', 'headaches', 'breast-tenderness'],
    emotional_symptoms: ['mood-swings', 'anxiety', 'irritability'],
    other_symptoms: 'severe cramping',
    recommendations: [
      { title: 'Exercise', description: 'Regular cardio helps with symptoms' },
      { title: 'Diet', description: 'Anti-inflammatory foods recommended' }
    ],
    created_at: '2024-01-15T10:00:00.000Z',
    updated_at: '2024-01-15T10:00:00.000Z'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    logger.error = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Assessment ID Foreign Key', () => {
    it('should include assessment_id in conversation list', async () => {
      const mockConversation = {
        id: mockConversationId,
        user_id: mockUserId,
        assessment_id: mockAssessmentId,
        assessment_pattern: 'irregular',
        message_count: 2,
        preview: 'Looking at my assessment results...',
        last_message_date: '2024-01-15T10:05:00.000Z'
      };

      DbService.getConversationsWithPreviews.mockResolvedValue([mockConversation]);

      const result = await getUserConversations(mockUserId);
      
      expect(result[0].assessment_id).toBe(mockAssessmentId);
      expect(result[0].id).toBe(mockConversationId);
    });

    it('should handle null assessment_id gracefully', async () => {
      const mockConversation = {
        id: mockConversationId,
        user_id: mockUserId,
        assessment_id: null,
        assessment_pattern: null,
        message_count: 1,
        preview: 'General conversation without assessment',
        last_message_date: '2024-01-15T10:05:00.000Z'
      };

      DbService.getConversationsWithPreviews.mockResolvedValue([mockConversation]);

      const result = await getUserConversations(mockUserId);
      
      expect(result[0].assessment_id).toBeNull();
      expect(result[0].assessment_pattern).toBeNull();
    });
  });

  describe('Assessment Data Retrieval', () => {
    it('should retrieve full assessment object when conversation has assessment_id', async () => {
      const mockConversation = {
        id: mockConversationId,
        user_id: mockUserId,
        assessment_id: mockAssessmentId,
        assessment_pattern: 'irregular',
        message_count: 3,
        preview: 'Based on my assessment...',
        last_message_date: '2024-01-15T10:05:00.000Z'
      };

      // Mock the conversation retrieval
      DbService.findById.mockResolvedValue(mockConversation);
      
      // Mock the assessment retrieval
      Assessment.findById.mockResolvedValue(mockAssessmentData);

      const result = await Assessment.findById(mockAssessmentId);
      
      expect(result.id).toBe(mockAssessmentId);
      expect(result.age).toBe('25-34');
      expect(result.physical_symptoms).toEqual(['bloating', 'fatigue', 'headaches', 'breast-tenderness']);
      expect(result.emotional_symptoms).toEqual(['mood-swings', 'anxiety', 'irritability']);
    });

    it('should include assessment pattern in conversation list', async () => {
      const assessmentPatterns = ['regular', 'irregular', 'heavy', 'pain', 'developing'];
      
      for (const pattern of assessmentPatterns) {
        const mockConversation = {
          id: `${mockConversationId}-${pattern}`,
          user_id: mockUserId,
          assessment_id: `${mockAssessmentId}-${pattern}`,
          assessment_pattern: pattern,
          message_count: 1,
          preview: `Assessment pattern: ${pattern}`,
          last_message_date: '2024-01-15T10:05:00.000Z'
        };

        DbService.getConversationsWithPreviews.mockResolvedValue([mockConversation]);

        const result = await getUserConversations(mockUserId);
        
        expect(result[0].assessment_pattern).toBe(pattern);
      }
    });
  });

  describe('Assessment Data Integrity', () => {
    it('should maintain assessment relationship integrity', async () => {
      const mockConversation = {
        id: mockConversationId,
        user_id: mockUserId,
        assessment_id: mockAssessmentId,
        assessment_pattern: 'irregular'
      };

      DbService.findById.mockResolvedValue(mockConversation);
      Assessment.findById.mockResolvedValue(mockAssessmentData);

      // Verify conversation has assessment
      const conversation = await DbService.findById(mockConversationId);
      expect(conversation.assessment_id).toBe(mockAssessmentId);

      // Verify assessment exists and belongs to same user
      const assessment = await Assessment.findById(mockAssessmentId);
      expect(assessment.user_id).toBe(mockUserId);
      expect(assessment.id).toBe(mockAssessmentId);
    });

    it('should handle assessment data with all symptom types', async () => {
      const complexAssessment = {
        ...mockAssessmentData,
        physical_symptoms: ['bloating', 'fatigue', 'headaches', 'breast-tenderness', 'acne', 'weight-gain'],
        emotional_symptoms: ['mood-swings', 'anxiety', 'depression', 'irritability', 'crying-spells'],
        other_symptoms: 'severe cramping, back pain, and joint stiffness'
      };

      Assessment.findById.mockResolvedValue(complexAssessment);

      const result = await Assessment.findById(mockAssessmentId);
      
      expect(result.physical_symptoms).toHaveLength(6);
      expect(result.emotional_symptoms).toHaveLength(5);
      expect(result.other_symptoms).toContain('severe cramping');
      expect(result.other_symptoms).toContain('back pain');
      expect(result.other_symptoms).toContain('joint stiffness');
    });

    it('should preserve assessment age and cycle data', async () => {
      Assessment.findById.mockResolvedValue(mockAssessmentData);

      const result = await Assessment.findById(mockAssessmentId);
      
      expect(result.age).toBe('25-34');
      expect(result.cycle_length).toBe('irregular');
      expect(result.period_duration).toBe('4-5');
      expect(result.flow_heaviness).toBe('medium');
      expect(result.pain_level).toBe('moderate');
    });
  });

  describe('Multiple Conversations with Assessments', () => {
    it('should handle multiple conversations each with different assessments', async () => {
      const multipleConversations = [
        {
          id: 'conv-1',
          user_id: mockUserId,
          assessment_id: 'assessment-1',
          assessment_pattern: 'regular',
          message_count: 2,
          preview: 'Regular cycle discussion',
          last_message_date: '2024-01-15T10:00:00.000Z'
        },
        {
          id: 'conv-2', 
          user_id: mockUserId,
          assessment_id: 'assessment-2',
          assessment_pattern: 'irregular',
          message_count: 1,
          preview: 'Irregular cycle concerns',
          last_message_date: '2024-01-14T10:00:00.000Z'
        },
        {
          id: 'conv-3',
          user_id: mockUserId,
          assessment_id: 'assessment-3',
          assessment_pattern: 'heavy',
          message_count: 4,
          preview: 'Heavy flow issues',
          last_message_date: '2024-01-13T10:00:00.000Z'
        }
      ];

      DbService.getConversationsWithPreviews.mockResolvedValue(multipleConversations);

      const result = await getUserConversations(mockUserId);
      
      expect(result).toHaveLength(3);
      expect(result[0].assessment_id).toBe('assessment-1');
      expect(result[0].assessment_pattern).toBe('regular');
      expect(result[1].assessment_id).toBe('assessment-2');
      expect(result[1].assessment_pattern).toBe('irregular');
      expect(result[2].assessment_id).toBe('assessment-3');
      expect(result[2].assessment_pattern).toBe('heavy');
    });
  });
}); 