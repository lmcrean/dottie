import DbService from '../../services/dbService.js';
import logger from '../../services/logger.js';

/**
 * Chat/Conversation Model
 * Simple data model representing conversation fields
 */
export class Chat {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.assessment_id = data.assessment_id;
    this.assessment_pattern = data.assessment_pattern;
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
      assessment_pattern: this.assessment_pattern,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at
    };
  }

  /**
   * Check if conversation is deleted
   * @returns {boolean}
   */
  isDeleted() {
    return this.deleted_at !== null;
  }

  /**
   * Check if conversation has assessment
   * @returns {boolean}
   */
  hasAssessment() {
    return this.assessment_id !== null;
  }

  /**
   * Get display pattern or fallback
   * @returns {string}
   */
  getDisplayPattern() {
    return this.assessment_pattern || 'General Chat';
  }
}

export default Chat; 