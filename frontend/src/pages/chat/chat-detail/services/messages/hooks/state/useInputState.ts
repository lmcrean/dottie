import React, { useState } from 'react';

interface UseInputStateProps {
  initialValue?: string;
}

interface UseInputStateReturn {
  input: string;
  setInput: (input: string) => void;
  clearInput: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, onEnter?: () => void) => void;
}

export function useInputState({ 
  initialValue = '' 
}: UseInputStateProps = {}): UseInputStateReturn {
  const [input, setInput] = useState(initialValue);

  const clearInput = () => {
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, onEnter?: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onEnter) {
        onEnter();
      }
    }
  };

  return {
    input,
    setInput,
    clearInput,
    handleKeyDown
  };
} 