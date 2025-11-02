import type { ConversationData } from '../types.js';

/**
 * Conversation Model
 * Pure data model representing conversation entities
 */
export class Conversation {
  id: number | string;
  user_id: number | string;
  assessment_id?: number | string | null;
  assessment_object?: any | null;
  assessment_pattern?: string | null;
  preview?: string | null;
  created_at: Date | string;
  updated_at: Date | string;
  deleted_at?: Date | string | null;

  constructor(data: ConversationData) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.assessment_id = data.assessment_id;
    this.assessment_object = data.assessment_object ?? null;
    this.assessment_pattern = data.assessment_pattern ?? null;
    this.preview = data.preview;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.deleted_at = data.deleted_at;
  }

  /**
   * Convert to plain object
   * @returns Plain object representation
   */
  toJSON(): ConversationData {
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
