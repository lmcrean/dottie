import React, { useState } from 'react';
import { Button } from '@/src/components/buttons/button';
import { Input } from '@/src/components/user-inputs/input';
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { sendMessage } from './api/sendMessage';

interface SendMessageButtonProps {
  chatId: string;
  onMessageSent?: (message: string, response: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function SendMessageButton({
  chatId,
  onMessageSent,
  placeholder = 'Type your message...',
  className = '',
  disabled = false
}: SendMessageButtonProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    const messageText = input.trim();
    if (!messageText || isLoading || disabled) return;

    setIsLoading(true);
    const originalMessage = messageText;
    setInput('');

    try {
      const response = await sendMessage({
        chat_id: chatId,
        message: messageText,
        conversationId: chatId
      });

      // Call callback if provided
      if (onMessageSent) {
        onMessageSent(originalMessage, response.content);
      }

      toast.success('Message sent successfully');
    } catch (error) {
      console.error('[SendMessageButton] Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      // Restore the input on error
      setInput(originalMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        disabled={isLoading || disabled}
        className="rounded-full border-gray-200 focus:border-pink-300 focus:ring-pink-200"
      />
      <Button
        onClick={handleSend}
        disabled={isLoading || disabled || !input.trim()}
        className="rounded-full bg-pink-600 text-white hover:bg-pink-700"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      </Button>
    </div>
  );
}

export default SendMessageButton;
