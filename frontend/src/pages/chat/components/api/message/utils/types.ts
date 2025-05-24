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

export interface ConversationListItem {
  id: string;
  last_message_date: string;
  preview: string;
}

export interface ChatResponse {
  message: string;
  conversationId: string;
}
