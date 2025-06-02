import React from 'react';
import { Message } from '../../../../types';

interface UseMessageStateProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

interface UseMessageStateReturn {
  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string) => void;
  addErrorMessage: () => void;
}

export function useMessageState({
  messages,
  setMessages
}: UseMessageStateProps): UseMessageStateReturn {
  const addUserMessage = (content: string) => {
    const newUserMessage: Message = {
      role: 'user',
      content,
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, newUserMessage]);
  };

  const addAssistantMessage = (content: string) => {
    const assistantMessage: Message = {
      role: 'assistant',
      content,
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, assistantMessage]);
  };

  const addErrorMessage = () => {
    const errorMessage: Message = {
      role: 'assistant',
      content:
        "I apologize, but I'm having trouble processing your request right now. Please try again later.",
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, errorMessage]);
  };

  return {
    addUserMessage,
    addAssistantMessage,
    addErrorMessage
  };
} 