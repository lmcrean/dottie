/**
 * Conversation Model
 * Pure data model representing conversation entities
 */
export class Conversation {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;                     // FK to User
    this.assessment_id = data.assessment_id;   
    this.assessment_object = data.assessment_object ?? null; // from the assessment_id, fetch the assessment object
    this.assessment_pattern = data.assessment_pattern ?? null; // from the assessment_object, extract the pattern
    this.preview = data.preview; // preview of most recent message
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.deleted_at = data.deleted_at;
  }

  /**
   * Convert to plain object
   * @returns {Object} - Plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      assessment_id: this.assessment_id,
      assessment_object: this.assessment_object,
      assessment_pattern: this.assessment_pattern,
      preview: this.preview,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at
    };
  }
} 