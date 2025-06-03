import React, { useRef, useEffect } from 'react';
import { ConversationListItem, AssessmentData } from '../../../../types';
import { Message } from '../../../types';
import { useConversationData } from './data/useConversationData';
import { useMessageSender } from '../../messages/hooks/sending/useMessageSender';
import { useMessageState } from '../../messages/hooks/state/useMessageState';
import { useInputState } from '../../messages/hooks/state/useInputState';
import { useConversationNavigation } from './navigation/useConversationNavigation';

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

  const {
    messages, setMessages, currentConversationId, assessmentId, assessmentObject,
    isLoading: conversationLoading, loadConversation, clearConversation
  } = useConversationData({ conversationId: chatId });

  const { addUserMessage, addAssistantMessage, addErrorMessage } = useMessageState({
    messages, setMessages
  });

  const { isLoading: sendingLoading, handleSend: sendMessage } = useMessageSender({
    currentConversationId, addUserMessage, addAssistantMessage, addErrorMessage, onSidebarRefresh
  });

  const { input, setInput, handleKeyDown, sendFromInput } = useInputState({
    onSend: sendMessage
  });

  const { handleConversationSelect, handleNewChat } = useConversationNavigation({
    onConversationLoad: loadConversation, onConversationClear: clearConversation
  });

  useEffect(() => {
    if (initialMessage && messages.length === 0 && !hasSentInitialMessage.current) {
      hasSentInitialMessage.current = true;
      sendMessage(initialMessage).catch((error: any) => {
        console.error('[useConversationPageState] Failed to send initial message:', error);
        hasSentInitialMessage.current = false;
      });
    }
  }, [initialMessage, messages.length, sendMessage]);

  return {
    messages, input, setInput, currentConversationId, assessmentId, assessmentObject,
    isLoading: conversationLoading || sendingLoading,
    handleSend: sendMessage, sendFromInput, handleConversationSelect, handleNewChat, handleKeyDown
  };
}
