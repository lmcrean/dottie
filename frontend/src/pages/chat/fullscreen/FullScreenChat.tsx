import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/src/components/buttons/button';
import { Input } from '@/src/components/user-inputs/input';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { Send, Loader2, X, Minimize2, Menu } from 'lucide-react';
import { getAIFeedback } from '@/src/services/ai';
import { ChatSidebar } from '../components/sidebar';
import { getConversation } from '../components/api/message/requests/getConversation';
import { ConversationListItem, ApiMessage } from '../components/api/message/utils/types';

interface FullscreenChatProps {
  onClose: () => void;
  initialMessage?: string;
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function FullscreenChat({ onClose, initialMessage, setIsFullscreen }: FullscreenChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasSentInitialMessage = useRef(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const sendInitialMessage = async () => {
      if (initialMessage && messages.length === 0 && !hasSentInitialMessage.current) {
        hasSentInitialMessage.current = true;
        await handleSend(initialMessage);
      }
    };

    sendInitialMessage();
  }, [initialMessage]);

  // Note: For now, FullScreenChat starts with empty state since it's used for new conversations
  // To load historical conversations, we would need a conversationId prop and use getConversation API
  // useEffect(() => {
  //   // TODO: If conversationId prop is provided, load that specific conversation
  //   // const loadConversation = async (conversationId: string) => {
  //   //   try {
  //   //     const response = await getConversation(conversationId);
  //   //     const messages = response.messages.map(msg => ({
  //   //       role: msg.role,
  //   //       content: msg.content
  //   //     }));
  //   //     setMessages(messages);
  //   //   } catch (error) {
  //   //     console.error('Error loading conversation:', error);
  //   //   }
  //   // };
  // }, []);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage = textToSend;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const userData = {
        age: sessionStorage.getItem('age') || '',
        cycleLength: sessionStorage.getItem('cycleLength') || '',
        periodDuration: sessionStorage.getItem('periodDuration') || '',
        flowHeaviness: sessionStorage.getItem('flowLevel') || '',
        painLevel: sessionStorage.getItem('painLevel') || '',
        symptoms: JSON.parse(sessionStorage.getItem('symptoms') || '[]')
      };

      const aiResponse = await getAIFeedback(userData, userMessage);
      setMessages((prev) => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I apologize, but I'm having trouble processing your request right now. Please try again later."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversationSelect = async (conversation: ConversationListItem) => {
    try {
      setCurrentConversationId(conversation.id);
      const fullConversation = await getConversation(conversation.id);
      const convertedMessages = fullConversation.messages.map((msg: ApiMessage) => ({
        role: msg.role,
        content: msg.content
      }));
      setMessages(convertedMessages);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const handleNewChat = () => {
    setCurrentConversationId(null);
    setMessages([]);
    setInput('');
    hasSentInitialMessage.current = false;

    // If there's an initial message, send it
    if (initialMessage) {
      handleSend(initialMessage);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex w-full bg-white dark:bg-gray-900">
      <div className="container mx-auto flex h-full max-w-7xl border border-gray-200 shadow-lg dark:border-slate-800">
        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="border-r border-gray-200 dark:border-gray-700">
            <ChatSidebar
              onConversationSelect={handleConversationSelect}
              onNewChat={handleNewChat}
              selectedConversationId={currentConversationId || undefined}
            />
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b bg-gradient-to-r from-pink-50 to-white p-4 dark:from-gray-900 dark:to-black">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="rounded-full hover:bg-pink-100"
              >
                <Menu className="h-4 w-4 text-pink-600" />
              </Button>
              <h1 className="text-lg font-bold text-pink-600">Chat with Dottie</h1>
            </div>
            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(false)}
                className="rounded-full hover:bg-pink-100"
              >
                <Minimize2 className="h-4 w-4 text-pink-600" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-pink-100"
              >
                <X className="h-4 w-4 text-pink-600" />
              </Button>
            </div>
          </header>
          <div className="flex flex-1 flex-col">
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
            <div className="flex gap-2 rounded-b-lg border-t bg-white p-4 dark:bg-gray-900">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
                className="rounded-full border-gray-200 focus:border-pink-300 focus:ring-pink-200"
              />
              <Button
                onClick={() => handleSend()}
                disabled={isLoading}
                className="rounded-full bg-pink-600 text-white hover:bg-pink-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
