import React, { useState } from 'react';

interface UseChatInputProps {
  onSend: (message?: string) => Promise<void>;
}

interface UseChatInputReturn {
  input: string;
  setInput: (input: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  clearInput: () => void;
  sendMessage: () => Promise<void>;
}

export function useChatInput({ onSend }: UseChatInputProps): UseChatInputReturn {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearInput = () => {
    setInput('');
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const messageToSend = input.trim();
    setInput(''); // Clear input immediately for better UX

    try {
      await onSend(messageToSend);
      console.log('[useChatInput] Message sent successfully');
    } catch (error) {
      console.error('[useChatInput] Failed to send message:', error);
      // Restore input if sending failed
      setInput(messageToSend);
    }
  };

  return {
    input,
    setInput,
    handleKeyDown,
    clearInput,
    sendMessage
  };
}
