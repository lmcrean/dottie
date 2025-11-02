import ParseAssessmentJson from './ParseAssessmentJson.js';
import type { AssessmentDbRecord, AssessmentApiResponse, Recommendation } from '../types.js';

class TransformDbToApi {
  /**
   * Transform database record to API response format
   * @param record - Database record
   * @returns API response object or null
   */
  static transform(record: AssessmentDbRecord | null): AssessmentApiResponse | null {
    if (!record) return null;

    // Parse array fields using the JSON parser utility
    const physical_symptoms = ParseAssessmentJson.parseArrayField(
      record.physical_symptoms, 'physical_symptoms', record.id
    );

    const emotional_symptoms = ParseAssessmentJson.parseArrayField(
      record.emotional_symptoms, 'emotional_symptoms', record.id
    );

    let recommendations: any[] = ParseAssessmentJson.parseArrayField(
      record.recommendations, 'recommendations', record.id
    );

    // Ensure recommendations have title and description
    if (Array.isArray(recommendations) && recommendations.length > 0) {
      // If recommendations are strings, convert to objects with title and description
      if (typeof recommendations[0] === 'string') {
        recommendations = recommendations.map(rec => ({
          title: rec,
          description: ''
        }));
      }
    }

    // Parse other_symptoms using special parser
    const other_symptoms = ParseAssessmentJson.parseOtherSymptoms(record.other_symptoms);

    // Validate arrays
    if (!Array.isArray(physical_symptoms)) {
      console.warn(`physical_symptoms is not an array after parsing for assessment ${record.id}, setting to empty array`);
    }

    if (!Array.isArray(emotional_symptoms)) {
      console.warn(`emotional_symptoms is not an array after parsing for assessment ${record.id}, setting to empty array`);
    }

    // Return format with all fields in snake_case
    const result: AssessmentApiResponse = {
      id: record.id,
      user_id: record.user_id,
      created_at: record.created_at,
      age: record.age,
      pattern: record.pattern,
      cycle_length: record.cycle_length,
      period_duration: record.period_duration,
      flow_heaviness: record.flow_heaviness,
      pain_level: record.pain_level,
      physical_symptoms: Array.isArray(physical_symptoms) ? physical_symptoms : [],
      emotional_symptoms: Array.isArray(emotional_symptoms) ? emotional_symptoms : [],
      other_symptoms,
      recommendations: recommendations as Recommendation[]
    };

    return result;
  }
}

export default TransformDbToApi;
