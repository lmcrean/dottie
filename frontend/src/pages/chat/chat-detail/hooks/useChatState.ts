import React from 'react';
import { ConversationListItem, AssessmentData } from '../../types';
import { Message } from '../types/chat';
import { useConversationData } from './useConversationData';
import { useMessageSending } from './useMessageSending';
import { useChatInput } from './useChatInput';
import { useChatNavigation } from './useChatNavigation';
import { useInitialMessage } from './useInitialMessage';

interface UseChatStateProps {
  chatId?: string;
  initialMessage?: string;
  onSidebarRefresh?: () => Promise<void>;
}

export interface UseChatStateReturn {
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  currentConversationId: string | null;
  handleSend: (messageText?: string) => Promise<void>;
  handleConversationSelect: (conversation: ConversationListItem) => void;
  handleNewChat: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  assessmentId: string | null;
  assessmentObject: AssessmentData | null;
}

export function useChatState({
  chatId,
  initialMessage,
  onSidebarRefresh
}: UseChatStateProps): UseChatStateReturn {
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
    sendMessage: sendFromInput
  } = useChatInput({ onSend: sendMessage });

  // Navigation between chats
  const { handleConversationSelect, handleNewChat } = useChatNavigation({
    onConversationLoad: loadConversation,
    onConversationClear: clearConversation
  });

  // Initial message handling
  useInitialMessage({
    initialMessage,
    messages,
    onSend: sendMessage
  });

  // Unified send handler that accepts optional message text
  const handleSend = async (messageText?: string) => {
    if (messageText) {
      await sendMessage(messageText);
    } else {
      await sendFromInput();
    }
  };

  // Combined loading state
  const isLoading = conversationLoading || sendingLoading;

  return {
    messages,
    input,
    setInput,
    isLoading,
    currentConversationId,
    handleSend,
    handleConversationSelect,
    handleNewChat,
    handleKeyDown,
    assessmentId,
    assessmentObject
  };
}
