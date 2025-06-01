import React, { useState } from 'react';
import { toast } from 'sonner';
import { sendMessage } from '../components/buttons/send-message';
import { Message } from '../types/chat';

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
  messages: _messages,
  setMessages,
  onSidebarRefresh
}: UseMessageSendingProps): UseMessageSendingReturn {
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText?.trim();
    if (!textToSend || isLoading) return;

    // Don't proceed if we don't have a conversation ID
    if (!currentConversationId) {
      toast.error('No active conversation. Please start a new chat.');
      return;
    }

    console.log(`[useMessageSending] Sending message to conversation: ${currentConversationId}`);

    // Ensure currentConversationId is a string
    const conversationIdString = String(currentConversationId);

    const userMessage = textToSend;

    // Add user message immediately to UI
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await sendMessage({
        chat_id: conversationIdString,
        message: userMessage,
        conversationId: conversationIdString
      });

      // Add assistant response to UI
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.content,
        created_at: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Refresh sidebar to show updated message count and preview
      if (onSidebarRefresh) {
        try {
          await onSidebarRefresh();
        } catch (error) {
          console.warn('Failed to refresh sidebar:', error);
          // Don't throw error as message was sent successfully
        }
      }

      console.log(`[useMessageSending] Message sent successfully`);
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message to UI
      const errorMessage: Message = {
        role: 'assistant',
        content:
          "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        created_at: new Date().toISOString()
      };

      setMessages((prev) => [...prev, errorMessage]);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSend
  };
}
