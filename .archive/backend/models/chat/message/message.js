/**
 * Message Model
 * Pure data model representing individual messages
 */
export class Message {
  constructor(data) {
    this.id = data.id;
    this.conversation_id = data.conversation_id;  // FK to Conversation
    this.user_id = data.user_id;                  // FK to User
    this.role = data.role;                        // 'user' | 'assistant' | 'system'
    this.content = data.content;
    this.parent_message_id = data.parent_message_id; // FK to Message (for threading)
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.edited_at = data.edited_at;
    this.deleted_at = data.deleted_at;
  }

  /**
   * Convert to plain object
   * @returns {Object} - Plain object representation
   */
  toJSON() {
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