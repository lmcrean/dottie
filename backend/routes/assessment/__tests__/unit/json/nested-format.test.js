// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { validateAssessmentData } from '../../../validators/index.js';
import Assessment from '../../../../../models/Assessment.js';

// Set test mode
process.env.TEST_MODE = 'true';

describe('Assessment with Nested JSON Format', () => {
  const userId = 'test-user-123';
  let assessmentId;

  // Sample assessment with new nested format
  const nestedAssessmentData = {
    assessment_data: {
      createdAt: '2025-04-17T09:31:10.925Z',
      assessment_data: {
        date: '2025-04-17T09:31:10.925Z',
        pattern: 'Regular',
        age: '18-24',
        cycleLength: '26-30',
        periodDuration: '4-5',
        flowHeaviness: 'moderate',
        painLevel: 'moderate',
        symptoms: {
          physical: ['Bloating', 'Headaches'],
          emotional: []
        },
        recommendations: [
          {
            title: 'Stay Hydrated',
            description: 'Drink at least 8 glasses of water daily to help reduce bloating.'
          },
          {
            title: 'Regular Exercise',
            description: 'Engage in light activities like walking or yoga to ease cramps.'
          }
        ]
      }
    }
  };

  test('should validate assessment with nested format', () => {
    const result = validateAssessmentData(nestedAssessmentData);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should create assessment with nested format', async () => {
    const created = await Assessment.create(nestedAssessmentData, userId);
    assessmentId = created.id;

    expect(created).toBeDefined();
    expect(created.id).toBeDefined();
    expect(created.userId).toBe(userId);
    
    // Check that the nested format is preserved
    expect(created.assessmentData).toBeDefined();
    expect(created.assessmentData.assessment_data).toBeDefined();
    expect(created.assessmentData.assessment_data.age).toBe('18-24');
    expect(created.assessmentData.assessment_data.cycleLength).toBe('26-30');
    expect(created.assessmentData.assessment_data.recommendations).toHaveLength(2);
  });

  test('should retrieve assessment with nested format', async () => {
    const retrieved = await Assessment.findById(assessmentId);
    
    expect(retrieved).toBeDefined();
    expect(retrieved.id).toBe(assessmentId);
    expect(retrieved.userId).toBe(userId);
    
    // Check that the nested format is preserved
    expect(retrieved.assessmentData).toBeDefined();
    expect(retrieved.assessmentData.assessment_data).toBeDefined();
    expect(retrieved.assessmentData.assessment_data.age).toBe('18-24');
    expect(retrieved.assessmentData.assessment_data.symptoms.physical).toContain('Bloating');
  });

  test('should update assessment with nested format', async () => {
    // Update just one field in the nested structure
    const updateData = {
      assessment_data: {
        age: '25-plus',
        symptoms: {
          physical: ['Bloating', 'Headaches', 'Cramps'],
          emotional: ['Mood swings']
        }
      }
    };
    
    const updated = await Assessment.update(assessmentId, updateData);
    
    expect(updated).toBeDefined();
    expect(updated.id).toBe(assessmentId);
    
    // Check that the nested format is preserved but updated
    expect(updated.assessment_data).toBeDefined();
    expect(updated.assessment_data.assessment_data).toBeDefined();
    expect(updated.assessment_data.assessment_data.age).toBe('25-plus');
    expect(updated.assessment_data.assessment_data.cycleLength).toBe('26-30'); // Unchanged
    expect(updated.assessment_data.assessment_data.symptoms.physical).toContain('Cramps');
    expect(updated.assessment_data.assessment_data.symptoms.emotional).toContain('Mood swings');
  });

  test('should delete assessment with nested format', async () => {
    const deleted = await Assessment.delete(assessmentId);
    expect(deleted).toBe(true);
    
    const notFound = await Assessment.findById(assessmentId);
    expect(notFound).toBeNull();
  });
}); 