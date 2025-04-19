import { useState, useEffect, useRef } from "react";
import { Button } from "@/src/components/ui/!to-migrate/button";
import { Input } from "@/src/components/ui/!to-migrate/input";
import { ScrollArea } from "@/src/components/ui/!to-migrate/scroll-area";
import { Send, Loader2, X, Minimize2 } from "lucide-react";
import { getAIFeedback } from "@/src/services/ai";
import axios from "axios";
import getHistory from "@/src/api/message/requests/getHistory";

interface FullscreenChatProps {
  onClose: () => void;
  initialMessage?: string;
  setIsFullscreen: (isFullscreen: boolean) => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function FullscreenChat({
  onClose,
  initialMessage,
  setIsFullscreen,
}: FullscreenChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getHistory();
        console.log(response);
        setMessages(response);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
    fetchHistory();
  }, []);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage = textToSend;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const userData = {
        age: sessionStorage.getItem("age") || "",
        cycleLength: sessionStorage.getItem("cycleLength") || "",
        periodDuration: sessionStorage.getItem("periodDuration") || "",
        flowHeaviness: sessionStorage.getItem("flowLevel") || "",
        painLevel: sessionStorage.getItem("painLevel") || "",
        symptoms: JSON.parse(sessionStorage.getItem("symptoms") || "[]"),
      };

      const aiResponse = await getAIFeedback(userData, userMessage);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col z-50 w-full ">
      <div className="container max-w-6xl mx-auto flex flex-col h-full border border-gray-200 rounded-lg shadow-lg p-0">
        <header className="flex items-center justify-between border-b bg-gradient-to-r from-pink-50 to-white p-4">
          <h1 className="text-lg font-bold text-pink-500">Chat with Dottie</h1>
          <div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(false)}
              className="rounded-full hover:bg-pink-100"
            >
              <Minimize2 className="h-4 w-4 text-pink-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-pink-100"
            >
              <X className="h-4 w-4 text-pink-500" />
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
                        ? "bg-pink-500 text-white"
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
                    <Loader2 className="h-4 w-4 animate-spin text-pink-500" />
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
              onClick={() => handleSend()}
              disabled={isLoading}
              className="rounded-full bg-pink-500 hover:bg-pink-600 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
