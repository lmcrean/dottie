import type { MessageRecord, MessageRole } from '../types.js';

/**
 * Message Model
 * Pure data model representing individual messages
 */
export class Message {
  id: number | string;
  conversation_id: number | string;
  user_id: number | string;
  role: MessageRole;
  content: string;
  parent_message_id?: number | string | null;
  created_at: Date | string;
  updated_at: Date | string;
  edited_at?: Date | string | null;
  deleted_at?: Date | string | null;

  constructor(data: MessageRecord) {
    this.id = data.id;
    this.conversation_id = data.conversation_id;
    this.user_id = data.user_id;
    this.role = data.role;
    this.content = data.content;
    this.parent_message_id = data.parent_message_id;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.edited_at = data.edited_at;
    this.deleted_at = data.deleted_at;
  }

  /**
   * Convert to plain object
   * @returns Plain object representation
   */
  toJSON(): MessageRecord {
    return {
      id: this.id,
      conversation_id: this.conversation_id,
      user_id: this.user_id,
      role: this.role,
      content: this.content,
      parent_message_id: this.parent_message_id,
      created_at: this.created_at,
      updated_at: this.updated_at,
      edited_at: this.edited_at,
      deleted_at: this.deleted_at
    };
  }
}

export default Message;
