import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import { Button } from '@/src/components/buttons/button';
import { Input } from '@/src/components/user-inputs/input';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { Send, Loader2, MessageCircle, Maximize2 } from 'lucide-react';
import { getAIFeedback } from '@/src/services/ai';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
  setIsFullscreen?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatModal({ isOpen, onClose, initialMessage, setIsFullscreen }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasSentInitialMessage = useRef(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Send initial message if provided
  useEffect(() => {
    const sendInitialMessage = async () => {
      if (isOpen && initialMessage && messages.length === 0 && !hasSentInitialMessage.current) {
        hasSentInitialMessage.current = true;
        await handleSend(initialMessage);
      }
    };

    sendInitialMessage();
  }, [isOpen, initialMessage]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage = textToSend;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Get user data from session storage
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden rounded-xl border-pink-100 bg-white p-0 shadow-lg dark:border-slate-800 dark:bg-gray-900 sm:max-w-[500px]">
        <DialogHeader className="flex flex-row items-center justify-between border-b bg-gradient-to-r from-pink-50 to-white p-4 dark:from-gray-900 dark:to-black">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-pink-600" />
            <DialogTitle className="text-lg font-bold text-pink-600">Chat with Dottie</DialogTitle>
          </div>
          <div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen && setIsFullscreen(true)}
              className="rounded-full hover:bg-pink-100"
            >
              <Maximize2 className="h-4 w-4 text-pink-600" />
            </Button>
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-pink-100"
            >
              <X className="h-4 w-4 text-pink-600" />
            </Button> */}
          </div>
        </DialogHeader>
        <div className="flex h-[500px] flex-col">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center p-8 text-center text-gray-500">
                  <MessageCircle className="mb-4 h-12 w-12 text-pink-200" />
                  <h3 className="mb-2 text-lg font-medium">Ask Dottie anything</h3>
                  <p className="text-sm">
                    {"I'm here to help with your menstrual health questions"}
                  </p>
                </div>
              )}
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
                        ? 'bg-pink-500 text-white'
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
                    <Loader2 className="h-4 w-4 animate-spin text-pink-500" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="flex gap-2 border-t bg-white p-4 dark:bg-gray-900">
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
              className="rounded-full bg-pink-500 text-white hover:bg-pink-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ChatModal;
