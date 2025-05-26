class ParseAssessmentJson {
  /**
   * Parse array field from database (handles both JSON strings and arrays)
   * @param {string|Array} field - Field to parse
   * @param {string} fieldName - Name of field for error logging
   * @param {string} assessmentId - Assessment ID for error logging
   * @returns {Array} Parsed array
   */
  static parseArrayField(field, fieldName, assessmentId) {
    if (!field) return [];
    
    try {
      // Handle case when field is already an array (from test environment)
      if (Array.isArray(field)) {
        return field;
      }
      
      // Parse JSON string
      return JSON.parse(field);
    } catch (error) {
      console.error(`Failed to parse ${fieldName} for assessment ${assessmentId}:`, error);
      console.error(`Raw value was: ${field}`);
      return [];
    }
  }

  /**
   * Parse other_symptoms field (special handling for string/array conversion)
   * @param {string} field - Field to parse
   * @returns {Array} Parsed array of symptoms
   */
  static parseOtherSymptoms(field) {
    if (!field) return [];
    
    try {
      // Attempt to parse as JSON array first
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) {
        return parsed.filter(s => typeof s === 'string'); // Ensure all elements are strings
      } else if (typeof parsed === 'string' && parsed.trim() !== '') {
        return [parsed.trim()];
      }
      return [];
    } catch (e) {
      // If JSON.parse fails, assume it's a plain string
      if (typeof field === 'string' && field.trim() !== '') {
        return [field.trim()];
      }
      return [];
    }
  }

  /**
   * Serialize array field for database storage
   * @param {Array} field - Array to serialize
   * @returns {string|null} JSON string or null
   */
  static serializeArrayField(field) {
    return field ? JSON.stringify(field) : null;
  }

  /**
   * Serialize other_symptoms for database storage
   * @param {string|Array} field - Field to serialize
   * @returns {string|null} JSON string or null
   */
  static serializeOtherSymptoms(field) {
    if (!field) return null;
    
    if (typeof field === 'string' && field.trim() !== '') {
      return JSON.stringify([field.trim()]);
    }
    
    if (Array.isArray(field) && field.length > 0) {
      return JSON.stringify(field);
    }
    
    return null;
  }
}

export default ParseAssessmentJson; 