export interface Message {
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
} 