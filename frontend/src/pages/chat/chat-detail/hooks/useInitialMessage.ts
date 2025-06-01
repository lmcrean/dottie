import { useRef, useEffect } from 'react';
import { Message } from '../types/chat';

interface UseInitialMessageProps {
  initialMessage?: string;
  messages: Message[];
  onSend: (message: string) => Promise<void>;
}

interface UseInitialMessageReturn {
  hasSentInitialMessage: boolean;
}

export function useInitialMessage({
  initialMessage,
  messages,
  onSend
}: UseInitialMessageProps): UseInitialMessageReturn {
  const hasSentInitialMessage = useRef(false);

  // Auto-send initial message if provided
  useEffect(() => {
    const sendInitialMessage = async () => {
      if (initialMessage && messages.length === 0 && !hasSentInitialMessage.current) {
        console.log('[useInitialMessage] Sending initial message:', initialMessage);
        hasSentInitialMessage.current = true;

        try {
          await onSend(initialMessage);
        } catch (error) {
          console.error('[useInitialMessage] Failed to send initial message:', error);
          // Reset flag so user can try again
          hasSentInitialMessage.current = false;
        }
      }
    };

    sendInitialMessage();
  }, [initialMessage, messages.length, onSend]);

  return {
    hasSentInitialMessage: hasSentInitialMessage.current
  };
}
