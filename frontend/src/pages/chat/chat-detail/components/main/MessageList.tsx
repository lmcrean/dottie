import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../../types';
import { formatMessageTimestamp } from '../../utils/formatTimestamp';

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
            <div className={`max-w-[80%] ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div
                className={`rounded-xl p-3 ${
                  message.role === 'user'
                    ? 'bg-pink-600 text-white'
                    : 'border border-gray-100 bg-gray-50 text-gray-900'
                }`}
              >
                {message.role === 'user' ? (
                  message.content
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Paragraphs
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      // Strong (bold) text
                      strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">{children}</strong>
                      ),
                      // Emphasis (italic) text
                      em: ({ children }) => <em className="italic">{children}</em>,
                      // Unordered lists
                      ul: ({ children }) => (
                        <ul className="mb-2 ml-4 list-disc space-y-1">{children}</ul>
                      ),
                      // Ordered lists
                      ol: ({ children }) => (
                        <ol className="mb-2 ml-4 list-decimal space-y-1">{children}</ol>
                      ),
                      // List items
                      li: ({ children }) => <li className="text-gray-900">{children}</li>,
                      // Headings
                      h1: ({ children }) => (
                        <h1 className="mb-2 text-xl font-bold text-gray-900">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="mb-2 text-lg font-bold text-gray-900">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="mb-2 text-base font-semibold text-gray-900">{children}</h3>
                      ),
                      // Links
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          className="text-pink-600 underline hover:text-pink-700"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                      // Code blocks
                      code: ({ children, className }) => {
                        const isInline = !className?.includes('language-');
                        return isInline ? (
                          <code className="rounded bg-gray-200 px-1 py-0.5 text-sm">
                            {children}
                          </code>
                        ) : (
                          <code className="block rounded bg-gray-200 p-2 text-sm">{children}</code>
                        );
                      },
                      // Blockquotes
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-pink-400 pl-3 italic text-gray-700">
                          {children}
                        </blockquote>
                      )
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
              </div>
              <div
                className={`mt-1 text-xs text-gray-500 ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                {formatMessageTimestamp(message.created_at)}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex animate-fadeIn justify-start">
            <div className="max-w-[80%] text-left">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <Loader2 className="h-4 w-4 animate-spin text-pink-600" />
              </div>
              <div className="mt-1 text-left text-xs text-gray-500">Typing...</div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
