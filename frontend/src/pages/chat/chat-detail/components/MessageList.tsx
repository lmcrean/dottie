import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { Message } from '../types/chat';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            } animate-fadeIn`}
          >
            <div
              className={`max-w-[80%] rounded-xl p-3 ${
                message.role === 'user'
                  ? 'bg-pink-600 text-white'
                  : 'border border-gray-100 bg-gray-50 text-gray-900'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex animate-fadeIn justify-start">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <Loader2 className="h-4 w-4 animate-spin text-pink-600" />
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
