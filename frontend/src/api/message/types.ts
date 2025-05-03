// Message API Types
export interface ApiMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  messages: ApiMessage[];
  lastMessageDate: string;
  preview: string;
}

export interface ChatResponse {
  message: string;
  conversationId: string;
}
