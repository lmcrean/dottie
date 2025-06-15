import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fetchAssessmentObject, extractAssessmentPattern } from '../database/assessmentObjectLink.js';
import DbService from '../../../../../services/db-service/dbService.js';
import logger from '../../../../../services/logger.js';

// Mock dependencies
vi.mock('../../../../../services/db-service/dbService.js');
vi.mock('../../../../../services/logger.js');

describe('assessmentObjectLink', () => {
  const mockAssessmentId = 'test-assessment-123';
  const mockAssessmentData = {
    id: 'test-assessment-123',
    user_id: 'user-456',
    age: '25-34',
    pattern: 'irregular',
    cycle_length: 'varies',
    period_duration: '5-7',
    flow_heaviness: 'heavy',
    pain_level: 'severe',
    physical_symptoms: ['bloating', 'fatigue', 'headaches'],
    emotional_symptoms: ['mood-swings', 'anxiety'],
    other_symptoms: 'back pain',
    recommendations: [
      { title: 'Track Symptoms', description: 'Keep a symptom diary' },
      { title: 'Consult Doctor', description: 'Consider medical evaluation' }
    ],
    created_at: '2024-01-15T10:00:00.000Z',
    updated_at: '2024-01-15T10:00:00.000Z'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    logger.info = vi.fn();
    logger.debug = vi.fn();
    logger.warn = vi.fn();
    logger.error = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchAssessmentObject', () => {
    it('should fetch and structure assessment object correctly', async () => {
      DbService.findById.mockResolvedValue(mockAssessmentData);

      const result = await fetchAssessmentObject(mockAssessmentId);

      expect(DbService.findById).toHaveBeenCalledWith('assessments', mockAssessmentId);
      expect(result).toEqual(mockAssessmentData);
      expect(logger.info).toHaveBeenCalledWith(
        `Successfully fetched assessment object for ${mockAssessmentId}`,
        { pattern: 'irregular' }
      );
    });

    it('should return null when no assessment ID provided', async () => {
      const result = await fetchAssessmentObject(null);

      expect(result).toBeNull();
      expect(DbService.findById).not.toHaveBeenCalled();
      expect(logger.debug).toHaveBeenCalledWith('No assessment ID provided for fetching');
    });

    it('should return null when assessment not found', async () => {
      DbService.findById.mockResolvedValue(null);

      const result = await fetchAssessmentObject(mockAssessmentId);

      expect(result).toBeNull();
      expect(logger.warn).toHaveBeenCalledWith(`Assessment ${mockAssessmentId} not found`);
    });

    it('should handle missing optional fields gracefully', async () => {
      const minimalAssessment = {
        id: mockAssessmentId,
        user_id: 'user-456',
        age: '18-24',
        pattern: 'regular',
        cycle_length: '28-30',
        period_duration: '3-4',
        flow_heaviness: 'light',
        pain_level: 'mild'
      };
      DbService.findById.mockResolvedValue(minimalAssessment);

      const result = await fetchAssessmentObject(mockAssessmentId);

      expect(result).toEqual({
        ...minimalAssessment,
        physical_symptoms: [],
        emotional_symptoms: [],
        other_symptoms: null,
        recommendations: []
      });
    });

    it('should throw error when database operation fails', async () => {
      const dbError = new Error('Database connection failed');
      DbService.findById.mockRejectedValue(dbError);

      await expect(fetchAssessmentObject(mockAssessmentId))
        .rejects.toThrow('Failed to fetch assessment data: Database connection failed');
      
      expect(logger.error).toHaveBeenCalledWith(
        `Error fetching assessment object for ${mockAssessmentId}:`,
        dbError
      );
    });
  });

  describe('extractAssessmentPattern', () => {
    it('should extract pattern from valid assessment object', () => {
      const result = extractAssessmentPattern(mockAssessmentData);
      expect(result).toBe('irregular');
    });

    it('should return null for null assessment object', () => {
      const result = extractAssessmentPattern(null);
      expect(result).toBeNull();
    });

    it('should return null for undefined assessment object', () => {
      const result = extractAssessmentPattern(undefined);
      expect(result).toBeNull();
    });

    it('should return null when pattern is missing', () => {
      const assessmentWithoutPattern = { ...mockAssessmentData };
      delete assessmentWithoutPattern.pattern;
      
      const result = extractAssessmentPattern(assessmentWithoutPattern);
      expect(result).toBeNull();
    });

    it('should handle different pattern types', () => {
      const patterns = ['regular', 'irregular', 'heavy', 'pain', 'developing'];
      
      patterns.forEach(pattern => {
        const assessment = { ...mockAssessmentData, pattern };
        const result = extractAssessmentPattern(assessment);
        expect(result).toBe(pattern);
      });
    });
  });
}); 