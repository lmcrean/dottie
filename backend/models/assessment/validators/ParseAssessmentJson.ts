/**
 * ParseAssessmentJson - Utility class for parsing and serializing assessment JSON data
 * Handles conversion between string and object formats for assessment fields
 */
class ParseAssessmentJson {
  /**
   * Parse an array field from string or return empty array
   * @param {string|null} fieldValue - JSON string or null/undefined
   * @param {string} fieldName - Name of the field for logging
   * @param {string} assessmentId - Assessment ID for logging
   * @returns {Array} Parsed array or empty array
   */
  static parseArrayField(fieldValue, fieldName, assessmentId) {
    if (!fieldValue || fieldValue === '') {
      return [];
    }

    try {
      if (Array.isArray(fieldValue)) {
        return fieldValue;
      }

      if (typeof fieldValue === 'string') {
        const parsed = JSON.parse(fieldValue);
        return Array.isArray(parsed) ? parsed : [];
      }

      return [];
    } catch (error) {
      console.warn(`Failed to parse ${fieldName} for assessment ${assessmentId}:`, error);
      return [];
    }
  }

  /**
   * Parse other symptoms field specifically
   * @param {string|Array|null} symptomsValue - Symptoms value in various formats
   * @returns {Array} Array of symptoms
   */
  static parseOtherSymptoms(symptomsValue) {
    if (!symptomsValue) {
      return [];
    }

    // If already an array
    if (Array.isArray(symptomsValue)) {
      return symptomsValue.filter(s => s && s.trim());
    }

    // If string
    if (typeof symptomsValue === 'string') {
      const trimmed = symptomsValue.trim();
      if (!trimmed) {
        return [];
      }

      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.filter(s => s && s.trim());
        }
        return [trimmed];
      } catch (error) {
        // If not valid JSON, treat as single symptom
        return [trimmed];
      }
    }

    return [];
  }

  /**
   * Serialize array field to JSON string
   * @param {Array|null} arrayValue - Array to serialize
   * @returns {string|null} JSON string or null
   */
  static serializeArrayField(arrayValue) {
    if (!arrayValue || !Array.isArray(arrayValue) || arrayValue.length === 0) {
      return null;
    }

    try {
      return JSON.stringify(arrayValue);
    } catch (error) {
      console.warn('Failed to serialize array field:', error);
      return null;
    }
  }

  /**
   * Serialize other symptoms to JSON string
   * @param {string|Array|null} symptomsValue - Symptoms value
   * @returns {string|null} JSON string or null
   */
  static serializeOtherSymptoms(symptomsValue) {
    if (!symptomsValue) {
      return null;
    }

    if (typeof symptomsValue === 'string') {
      const trimmed = symptomsValue.trim();
      if (!trimmed) {
        return null;
      }
      return JSON.stringify([trimmed]);
    }

    if (Array.isArray(symptomsValue)) {
      const filtered = symptomsValue.filter(s => s && s.trim());
      if (filtered.length === 0) {
        return null;
      }
      return JSON.stringify(filtered);
    }

    return null;
  }
}

export default ParseAssessmentJson; 