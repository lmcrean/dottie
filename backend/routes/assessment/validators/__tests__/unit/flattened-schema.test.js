import { expect, describe, it } from 'vitest';
import Assessment from '../../../../models/assessment/Assessment.js';

describe('Assessment Schema Flattening Tests', () => {
  const userId = 'test-user-123';
  const assessmentId = 'test-assessment-123';
  const now = new Date().toISOString();
  
  // Helper function to access the private method for testing
  function transformDbRecordToApiResponse(record) {
    return Assessment._transformDbRecordToApiResponse(record);
  }
  
  describe('Data Transformation', () => {
    it('should transform legacy nested format correctly', () => {
      // Create a mock DB record with legacy nested format
      const nestedData = {
        age: '25-34',
        pattern: 'regular',
        cycleLength: '26-30',
        periodDuration: '4-5',
        flowHeaviness: 'moderate',
        painLevel: 'moderate',
        symptoms: {
          physical: ['Bloating', 'Headaches'],
          emotional: ['Mood swings', 'Irritability']
        },
        recommendations: [
          {
            title: 'Recommendation 1',
            description: 'Description for recommendation 1'
          }
        ]
      };
      
      const dbRecord = {
        id: assessmentId,
        user_id: userId,
        assessment_data: JSON.stringify(nestedData),
        created_at: now,
        updated_at: now
      };
      
      // Transform the record
      const result = transformDbRecordToApiResponse(dbRecord);
      
      // Verify the result
      expect(result).toEqual({
        id: assessmentId,
        userId,
        assessmentData: nestedData,
        createdAt: now,
        updatedAt: now
      });
    });
    
    it('should transform new flattened format correctly', () => {
      // Create a mock DB record with flattened format
      const dbRecord = {
        id: assessmentId,
        user_id: userId,
        age: '25-34',
        pattern: 'regular',
        cycle_length: '26-30',
        period_duration: '4-5',
        flow_heaviness: 'moderate',
        pain_level: 'moderate',
        physical_symptoms: JSON.stringify(['Bloating', 'Headaches']),
        emotional_symptoms: JSON.stringify(['Mood swings', 'Irritability']),
        recommendations: JSON.stringify([
          {
            title: 'Recommendation 1',
            description: 'Description for recommendation 1'
          }
        ]),
        created_at: now,
        updated_at: now
      };
      
      // Transform the record
      const result = transformDbRecordToApiResponse(dbRecord);
      
      // Verify the result is transformed to the expected API format
      expect(result).toEqual({
        id: assessmentId,
        userId,
        assessmentData: {
          age: '25-34',
          pattern: 'regular',
          cycleLength: '26-30',
          periodDuration: '4-5',
          flowHeaviness: 'moderate',
          painLevel: 'moderate',
          symptoms: {
            physical: ['Bloating', 'Headaches'],
            emotional: ['Mood swings', 'Irritability']
          },
          recommendations: [
            {
              title: 'Recommendation 1',
              description: 'Description for recommendation 1'
            }
          ]
        },
        createdAt: now,
        updatedAt: now
      });
    });
    
    it('should handle null or empty fields in flattened format', () => {
      // Create a record with some missing fields
      const dbRecord = {
        id: assessmentId,
        user_id: userId,
        age: '25-34',
        pattern: 'regular',
        // Some fields missing
        created_at: now,
        updated_at: now
      };
      
      // Transform the record
      const result = transformDbRecordToApiResponse(dbRecord);
      
      // Verify the result handles missing fields
      expect(result).toEqual({
        id: assessmentId,
        userId,
        assessmentData: {
          age: '25-34',
          pattern: 'regular',
          cycleLength: undefined,
          periodDuration: undefined,
          flowHeaviness: undefined,
          painLevel: undefined,
          symptoms: {
            physical: [],
            emotional: []
          },
          recommendations: []
        },
        createdAt: now,
        updatedAt: now
      });
    });
    
    it('should handle malformed JSON fields gracefully', () => {
      // Create a record with malformed JSON in some fields but valid in others
      const dbRecord = {
        id: assessmentId,
        user_id: userId,
        age: '25-34',
        pattern: 'regular',
        physical_symptoms: '{"BAD_JSON',  // Malformed JSON
        emotional_symptoms: '[]',  // Valid but empty
        recommendations: '["BAD"',  // Another malformed field
        created_at: now,
        updated_at: now
      };
      
      // Transform the record
      const result = transformDbRecordToApiResponse(dbRecord);
      
      // Verify it handled the malformed JSON gracefully and kept valid fields
      expect(result.id).toEqual(assessmentId);
      expect(result.userId).toEqual(userId);
      expect(result.assessmentData.age).toEqual('25-34');
      expect(result.assessmentData.pattern).toEqual('regular');
      expect(result.assessmentData.symptoms.physical).toEqual([]);  // Empty for malformed
      expect(result.assessmentData.symptoms.emotional).toEqual([]);  // Valid empty array
      expect(result.assessmentData.recommendations).toEqual([]);  // Empty for malformed
    });
  });
}); 