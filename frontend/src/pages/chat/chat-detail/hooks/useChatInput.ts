import React from 'react';
import { useInputState } from './useInputState';
import { useInputSender } from './useInputSender';

interface UseChatInputProps {
  onSend: (message: string) => Promise<void>;
}

interface UseChatInputReturn {
  input: string;
  setInput: (input: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  clearInput: () => void;
  sendFromInput: () => Promise<void>;
}

export function useChatInput({ onSend }: UseChatInputProps): UseChatInputReturn {
  // Pure input management
  const { input, setInput, clearInput, handleKeyDown: baseHandleKeyDown } = useInputState();
  
  // Input-to-send coordination
  const { sendFromInput } = useInputSender({
    input,
    clearInput,
    onSend
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    baseHandleKeyDown(e, sendFromInput);
  };

  return {
    input,
    setInput,
    handleKeyDown,
    clearInput,
    sendFromInput
  };
}
