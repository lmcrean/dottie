import { useState, useRef, useEffect } from 'react';
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
  const [sendingMessageId, setSendingMessageId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText?.trim();

    // Prevent concurrent sends with atomic check
    if (!textToSend || isLoading || sendingMessageId) {
      if (isLoading || sendingMessageId) {
        console.log('[useMessageSender] Cannot send: already sending a message');
      }
      return;
    }

    // Don't proceed if we don't have a conversation ID
    if (!currentConversationId) {
      toast.error('No active conversation. Please start a new chat.');
      return;
    }

    console.log(`[useMessageSender] Sending message to conversation: ${currentConversationId}`);

    // Ensure currentConversationId is a string
    const conversationIdString = String(currentConversationId);
    const userMessage = textToSend;

    // Generate unique message ID for tracking
    const messageId = crypto.randomUUID();

    // Create abort controller for cancellation support
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Set state atomically to prevent race conditions
    setSendingMessageId(messageId);
    setIsLoading(true);

    try {
      // Add user message immediately to UI (optimistic update)
      addUserMessage(userMessage);

      // Send message with abort signal
      const response = await sendMessage({
        chat_id: conversationIdString,
        message: userMessage,
        conversationId: conversationIdString
      });

      // Only proceed if not aborted
      if (!abortController.signal.aborted) {
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
      }
    } catch (error: unknown) {
      // Check if the error is due to abort
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('[useMessageSender] Message send cancelled');
        return;
      }

      console.error('Error sending message:', error);
      addErrorMessage();
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
      setSendingMessageId(null);
      abortControllerRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    isLoading,
    handleSend
  };
}
