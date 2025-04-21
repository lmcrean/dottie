import React from 'react';
import { X, Minimize2, Send, Loader2 } from 'lucide-react';
import { Button } from "@/src/components/ui/!to-migrate/button";
import { Input } from "@/src/components/ui/!to-migrate/input";
import { ScrollArea } from "@/src/components/ui/!to-migrate/scroll-area";
import { useState, useRef } from 'react';

interface FullscreenChatProps {
  isOpen: boolean;
  onClose: () => void;
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
  initialMessage?: string;
}

export const FullscreenChat: React.FC<FullscreenChatProps> = ({ 
  isOpen, 
  onClose, 
  setIsFullscreen,
  initialMessage = "Hello! I'm Dottie. How can I help you understand your assessment results today?"
}) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: initialMessage }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  const handleSend = () => {
    if (input.trim() === '' || isLoading) return;
    
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: "I'm just a frontend component right now. Soon I'll be connected to a real AI assistant!" 
      }]);
      setIsLoading(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white flex flex-col z-50 w-full ">
      <div className="container max-w-6xl mx-auto flex flex-col h-full border border-gray-200 rounded-lg shadow-lg p-0">
        <header className="flex items-center justify-between border-b bg-gradient-to-r from-pink-50 to-white p-4">
          <h1 className="text-lg font-bold text-pink-600">Chat with Dottie</h1>
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
        <div className="flex flex-col flex-1">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  } animate-fadeIn`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-3 ${
                      message.role === "user"
                        ? "bg-pink-600 text-white"
                        : "bg-gray-50 text-gray-900 border border-gray-100"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <Loader2 className="h-4 w-4 animate-spin text-pink-600" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="flex gap-2 p-4 border-t bg-white">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isLoading}
              className="rounded-full border-gray-200 focus:border-pink-300 focus:ring-pink-200"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading}
              className="rounded-full bg-pink-600 hover:bg-pink-700 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 