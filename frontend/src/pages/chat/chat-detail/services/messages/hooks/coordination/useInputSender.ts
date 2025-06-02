interface UseInputSenderProps {
  input: string;
  clearInput: () => void;
  onSend: (message: string) => Promise<void>;
}

interface UseInputSenderReturn {
  sendFromInput: () => Promise<void>;
}

export function useInputSender({
  input,
  clearInput,
  onSend
}: UseInputSenderProps): UseInputSenderReturn {
  const sendFromInput = async () => {
    if (!input.trim()) return;

    const messageToSend = input.trim();
    clearInput(); // Clear input immediately for better UX

    try {
      await onSend(messageToSend);
      console.log('[useInputSender] Message sent successfully from input');
    } catch (error) {
      console.error('[useInputSender] Failed to send message from input:', error);
      // Note: We don't restore input here as the error handling 
      // should be done by the main sending logic
    }
  };

  return {
    sendFromInput
  };
} 