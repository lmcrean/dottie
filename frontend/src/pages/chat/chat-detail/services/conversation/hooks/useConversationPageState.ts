import React, { useRef, useEffect } from 'react';
import { ConversationListItem, AssessmentData } from '../../../../types';
import { Message } from '../../../types/chat';
import { useConversationData } from './data/useConversationData';
import { useMessageSending } from '../../messages/hooks/sending/useMessageSending';
import { useInputState } from '../../messages/hooks/state/useInputState';
import { useInputSender } from '../../messages/hooks/coordination/useInputSender';
import { useConversationNavigation } from './navigation/useConversationNavigation';

/**
 * Main hook for managing the overall chat page state
 * Orchestrates conversation data, message sending, input handling, and navigation
 * This manages the high-level chat page including the currently active conversation
 */

export interface UseConversationPageStateProps {
  chatId?: string;
  initialMessage?: string;
  onSidebarRefresh?: () => Promise<void>;
}

export interface UseConversationPageStateReturn {
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

export function useConversationPageState({
  chatId,
  initialMessage,
  onSidebarRefresh
}: UseConversationPageStateProps): UseConversationPageStateReturn {
  const hasSentInitialMessage = useRef(false);

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

  // Input state management
  const { input, setInput, clearInput, handleKeyDown: baseHandleKeyDown } = useInputState();
  
  // Input-to-send coordination
  const { sendFromInput } = useInputSender({
    input,
    clearInput,
    onSend: sendMessage
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    baseHandleKeyDown(e, sendFromInput);
  };

  // Navigation between chats
  const { handleConversationSelect, handleNewChat } = useConversationNavigation({
    onConversationLoad: loadConversation,
    onConversationClear: clearConversation
  });

  // Auto-send initial message (replaces useInitialMessage hook)
  useEffect(() => {
    if (initialMessage && messages.length === 0 && !hasSentInitialMessage.current) {
      console.log('[useConversationPageState] Auto-sending initial message:', initialMessage);
      hasSentInitialMessage.current = true;
      
      sendMessage(initialMessage).catch((error: any) => {
        console.error('[useConversationPageState] Failed to send initial message:', error);
        hasSentInitialMessage.current = false; // Reset on failure
      });
    }
  }, [initialMessage, messages.length, sendMessage]);

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
