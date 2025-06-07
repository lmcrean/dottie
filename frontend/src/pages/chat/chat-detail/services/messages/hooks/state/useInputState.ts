import React, { useState } from 'react';

interface UseInputStateProps {
  initialValue?: string;
  onSend?: (message: string) => Promise<void>;
}

interface UseInputStateReturn {
  input: string;
  setInput: (input: string) => void;
  clearInput: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, onEnter?: () => void) => void;
  sendFromInput: () => Promise<void>;
}

export function useInputState({ 
  initialValue = '',
  onSend
}: UseInputStateProps = {}): UseInputStateReturn {
  const [input, setInput] = useState(initialValue);

  const clearInput = () => {
    setInput('');
  };

  const sendFromInput = async () => {
    if (!input.trim() || !onSend) return;

    const messageToSend = input.trim();
    clearInput(); // Clear input immediately for better UX

    try {
      await onSend(messageToSend);
      console.log('[useInputState] Message sent successfully from input');
    } catch (error) {
      console.error('[useInputState] Failed to send message from input:', error);
      // Note: We don't restore input here as the error handling 
      // should be done by the main sending logic
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, onEnter?: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onEnter) {
        onEnter();
      } else if (onSend) {
        sendFromInput();
      }
    }
  };

  return {
    input,
    setInput,
    clearInput,
    handleKeyDown,
    sendFromInput
  };
} 