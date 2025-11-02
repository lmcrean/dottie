import type { Recommendation } from '../types.js';

class ParseAssessmentJson {
  /**
   * Parse array field from database (handles both JSON strings and arrays)
   * @param field - Field to parse
   * @param fieldName - Name of field for error logging
   * @param assessmentId - Assessment ID for error logging
   * @returns Parsed array
   */
  static parseArrayField(
    field: string | any[] | null,
    fieldName: string,
    assessmentId: string
  ): any[] {
    if (!field) return [];

    try {
      // Handle case when field is already an array (from test environment)
      if (Array.isArray(field)) {
        return field;
      }

      // Parse JSON string
      return JSON.parse(field as string);
    } catch (error) {
      console.error(`Failed to parse ${fieldName} for assessment ${assessmentId}:`, error);
      console.error(`Raw value was: ${field}`);
      return [];
    }
  }

  /**
   * Parse other_symptoms field (special handling for string/array conversion)
   * @param field - Field to parse
   * @returns Parsed array of symptoms
   */
  static parseOtherSymptoms(field: string | null): string[] {
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
   * @param field - Array to serialize
   * @returns JSON string or null
   */
  static serializeArrayField(field: any[] | Recommendation[] | undefined): string | null {
    return field ? JSON.stringify(field) : null;
  }

  /**
   * Serialize other_symptoms for database storage
   * @param field - Field to serialize
   * @returns JSON string or null
   */
  static serializeOtherSymptoms(field: string | string[] | undefined): string | null {
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
