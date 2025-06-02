import React from 'react';
import { ConversationListItem, AssessmentData } from '../../types';
import { Message } from '../types/chat';
import { useConversationData } from './useConversationData';
import { useMessageSending } from './useMessageSending';
import { useChatInput } from './useChatInput';
import { useConversationNavigation } from './useConversationNavigation';
import { useInitialMessage } from './useInitialMessage';

/**
 * Main hook for managing the overall chat page state
 * Orchestrates conversation data, message sending, input handling, and navigation
 * This manages the high-level chat page including the currently active conversation
 */

interface UseChatPageStateProps {
  chatId?: string;
  initialMessage?: string;
  onSidebarRefresh?: () => Promise<void>;
}

export interface UseChatPageStateReturn {
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  currentConversationId: string | null;
  handleSend: (messageText: string) => Promise<void>;
  sendFromInput: () => Promise<void>;
  handleConversationSelect: (conversation: ConversationListItem) => void;
  handleNewChat: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  assessmentId: string | null;
  assessmentObject: AssessmentData | null;
}

export function useChatPageState({
  chatId,
  initialMessage,
  onSidebarRefresh
}: UseChatPageStateProps): UseChatPageStateReturn {
  // Conversation data management
  const {
    messages,
    setMessages,
    currentConversationId,
    assessmentId,
    assessmentObject,
    isLoading: conversationLoading,
    loadConversation,
    clearConversation
  } = useConversationData({ conversationId: chatId });

  // Message sending functionality
  const { isLoading: sendingLoading, handleSend: sendMessage } = useMessageSending({
    currentConversationId,
    messages,
    setMessages,
    onSidebarRefresh
  });

  // Input state and keyboard handling
  const {
    input,
    setInput,
    handleKeyDown,
    sendFromInput
  } = useChatInput({ onSend: sendMessage });

  // Navigation between chats
  const { handleConversationSelect, handleNewChat } = useConversationNavigation({
    onConversationLoad: loadConversation,
    onConversationClear: clearConversation
  });

  // Initial message handling
  useInitialMessage({
    initialMessage,
    messages,
    onSend: sendMessage
  });

  // Use the main send handler directly (no duplication)
  const handleSend = sendMessage;

  // Combined loading state
  const isLoading = conversationLoading || sendingLoading;

  return {
    messages,
    input,
    setInput,
    isLoading,
    currentConversationId,
    handleSend,
    sendFromInput,
    handleConversationSelect,
    handleNewChat,
    handleKeyDown,
    assessmentId,
    assessmentObject
  };
}
