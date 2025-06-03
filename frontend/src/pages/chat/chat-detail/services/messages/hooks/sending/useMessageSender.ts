import { useState } from 'react';
import { toast } from 'sonner';
import { sendMessage } from '../../messageService';

interface UseMessageSenderProps {
  currentConversationId: string | null;
  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string) => void;
  addErrorMessage: () => void;
  onSidebarRefresh?: () => Promise<void>;
}

interface UseMessageSenderReturn {
  isLoading: boolean;
  handleSend: (messageText?: string) => Promise<void>;
}

export function useMessageSender({
  currentConversationId,
  addUserMessage,
  addAssistantMessage,
  addErrorMessage,
  onSidebarRefresh
}: UseMessageSenderProps): UseMessageSenderReturn {
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText?.trim();
    if (!textToSend || isLoading) return;

    // Don't proceed if we don't have a conversation ID
    if (!currentConversationId) {
      toast.error('No active conversation. Please start a new chat.');
      return;
    }

    console.log(`[useMessageSender] Sending message to conversation: ${currentConversationId}`);

    // Ensure currentConversationId is a string
    const conversationIdString = String(currentConversationId);
    const userMessage = textToSend;

    // Add user message immediately to UI
    addUserMessage(userMessage);
    setIsLoading(true);

    try {
      const response = await sendMessage({
        chat_id: conversationIdString,
        message: userMessage,
        conversationId: conversationIdString
      });

      // Add assistant response to UI
      addAssistantMessage(response.content);

      // Refresh sidebar to show updated message count and preview
      if (onSidebarRefresh) {
        try {
          await onSidebarRefresh();
        } catch (error) {
          console.warn('Failed to refresh sidebar:', error);
          // Don't throw error as message was sent successfully
        }
      }

      console.log(`[useMessageSender] Message sent successfully`);
    } catch (error) {
      console.error('Error sending message:', error);
      addErrorMessage();
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