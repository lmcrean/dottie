import { Message } from './message';

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  currentChatId: string | null;
} 