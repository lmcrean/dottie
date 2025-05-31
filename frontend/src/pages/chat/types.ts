// Shared types for chat functionality across all chat components

export interface ApiMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  created_at?: string;
}

export interface AssessmentData {
  id: string;
  age: number;
  pattern: string;
  cycle_length: number;
  period_duration: number;
  flow_heaviness: string;
  pain_level: number;
  physical_symptoms: string[];
  emotional_symptoms: string[];
  other_symptoms: string[];
  recommendations: Array<{
    title: string;
    description: string;
  }>;
}

export interface Conversation {
  id: string;
  messages: ApiMessage[];
  lastMessageDate?: string;
  preview?: string;
  assessment_id?: string;
  assessment_object?: AssessmentData; // Assessment data object containing pattern, symptoms, etc.
  assessment_pattern?: string;
}

export interface ConversationListItem {
  id: string;
  last_message_date: string;
  preview: string;
  message_count: number;
  assessment_id?: string;
  assessment_pattern?: string;
  user_id: string;
}

export interface ChatResponse {
  message: string;
  conversationId: string;
}
