import ParseAssessmentJson from './ParseAssessmentJson.js';

class TransformApiToDb {
  /**
   * Transform assessment data for database storage
   * @param {Object} assessmentData - Assessment data from API
   * @returns {Object} Database payload
   */
  static transform(assessmentData) {
    const {
      age, pattern, cycle_length, period_duration, flow_heaviness, pain_level, 
      physical_symptoms, emotional_symptoms, other_symptoms, recommendations
    } = assessmentData;

    return {
      age,
      pattern,
      cycle_length,
      period_duration,
      flow_heaviness,
      pain_level,
      other_symptoms: ParseAssessmentJson.serializeOtherSymptoms(other_symptoms),
      physical_symptoms: ParseAssessmentJson.serializeArrayField(physical_symptoms),
      emotional_symptoms: ParseAssessmentJson.serializeArrayField(emotional_symptoms),
      recommendations: ParseAssessmentJson.serializeArrayField(recommendations)
    };
  }
}

export default TransformApiToDb; 