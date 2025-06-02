import React from 'react';
import { useMessageState } from '../state/useMessageState';
import { useMessageSender } from './useMessageSender';
import { Message } from '../../../../types';

interface UseMessageSendingProps {
  currentConversationId: string | null;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onSidebarRefresh?: () => Promise<void>;
}

interface UseMessageSendingReturn {
  isLoading: boolean;
  handleSend: (messageText?: string) => Promise<void>;
}

export function useMessageSending({
  currentConversationId,
  messages,
  setMessages,
  onSidebarRefresh
}: UseMessageSendingProps): UseMessageSendingReturn {
  // Message state operations
  const { addUserMessage, addAssistantMessage, addErrorMessage } = useMessageState({
    messages,
    setMessages
  });

  // Message sending orchestration
  const { isLoading, handleSend } = useMessageSender({
    currentConversationId,
    addUserMessage,
    addAssistantMessage,
    addErrorMessage,
    onSidebarRefresh
  });

  return {
    isLoading,
    handleSend
  };
}
