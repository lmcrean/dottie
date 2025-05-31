import React from 'react';
import { Message } from './chat';

export interface UseChatStateProps {
  chatId?: string;
  initialMessage?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  currentChatId: string | null;
}

export interface UseChatStateReturn {
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  currentConversationId: string | null;
  handleSend: (messageText?: string) => Promise<void>;
  handleConversationSelect: (data: {
    messages: Message[];
    conversationId: string;
    assessmentId: string | null;
  }) => void;
  handleNewChat: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  assessmentId: string | null;
}
