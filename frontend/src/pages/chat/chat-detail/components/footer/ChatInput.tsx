import React from 'react';
import { Button } from '@/src/components/buttons/button';
import { Input } from '@/src/components/user-inputs/input';
import { Send } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function ChatInput({ input, setInput, isLoading, onSend, onKeyDown }: ChatInputProps) {
  return (
    <div className="flex gap-2 rounded-b-lg border-t bg-white p-4 dark:bg-gray-900">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        onKeyDown={onKeyDown}
        disabled={isLoading}
        className="rounded-full border-gray-200 focus:border-pink-300 focus:ring-pink-200"
      />
      <Button
        onClick={onSend}
        disabled={isLoading}
        className="rounded-full bg-pink-600 text-white hover:bg-pink-700"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
