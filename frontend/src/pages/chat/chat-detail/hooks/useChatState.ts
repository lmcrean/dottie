import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { sendMessage } from '../components/buttons/send-message';
import { ConversationListItem, ApiMessage } from '../../types';
import { Message } from '../types/chat';

interface UseChatStateProps {
  chatId?: string;
  initialMessage?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  currentChatId: string | null;
}

export interface UseChatStateReturn {
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  currentConversationId: string | null;
  handleSend: (messageText?: string) => Promise<void>;
  handleConversationSelect: (conversation: ConversationListItem) => Promise<void>;
  handleNewChat: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const MOCK_CONVERSATION_RESPONSE = {
  id: 'mock-conversation-123',
  messages: [
    {
      role: 'user' as const,
      content: 'Hello',
      timestamp: new Date().toISOString()
    },
    {
      role: 'assistant' as const,
      content:
        "Hi there! 👋 I'm Dottie. This is a mock conversation for development purposes. To see real conversations, please configure your backend environment variables.",
      timestamp: new Date().toISOString()
    }
  ]
};

export function useChatState({ chatId, initialMessage }: UseChatStateProps): UseChatStateReturn {
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(chatId || null);
  const hasSentInitialMessage = useRef(false);

  // Load existing conversation if chatId is provided
  useEffect(() => {
    if (chatId) {
      const loadExistingConversation = async () => {
        try {
          // Mock: For now, use the mock conversation
          // In real implementation, this would fetch from getConversation API
          const fullConversation = MOCK_CONVERSATION_RESPONSE;

          const convertedMessages = fullConversation.messages.map((msg: ApiMessage) => ({
            role: msg.role,
            content: msg.content
          }));
          setMessages(convertedMessages);
          setCurrentConversationId(chatId);
        } catch (error) {
          console.error('Error loading conversation:', error);
        }
      };
      loadExistingConversation();
    }
  }, [chatId]);

  // Auto-send initial message if provided
  useEffect(() => {
    const sendInitialMessage = async () => {
      if (initialMessage && messages.length === 0 && !hasSentInitialMessage.current) {
        hasSentInitialMessage.current = true;
        await handleSend(initialMessage);
      }
    };
    sendInitialMessage();
  }, [initialMessage, messages.length]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    // Don't proceed if we don't have a conversation ID
    if (!currentConversationId) {
      toast.error('No active conversation. Please start a new chat.');
      return;
    }

    const userMessage = textToSend;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await sendMessage({
        chat_id: currentConversationId,
        message: userMessage,
        conversationId: currentConversationId
      });

      setMessages((prev) => [...prev, { role: 'assistant', content: response.content }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I apologize, but I'm having trouble processing your request right now. Please try again later."
        }
      ]);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversationSelect = async (conversation: ConversationListItem) => {
    console.log('[useChatState] Selected conversation:', conversation);

    // Mock: Convert to our message format
    const convertedMessages = MOCK_CONVERSATION_RESPONSE.messages.map((msg: ApiMessage) => ({
      role: msg.role,
      content: msg.content
    }));

    setMessages(convertedMessages);
    setCurrentConversationId(conversation.id);

    // Navigate to the chat detail page
    navigate(`/chat/${conversation.id}`);
  };

  const handleNewChat = () => {
    setCurrentConversationId(null);
    setMessages([]);
    setInput('');
    hasSentInitialMessage.current = false;

    // Navigate to new chat page if needed
    if (window.location.pathname !== '/chat') {
      navigate('/chat');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    currentConversationId,
    handleSend,
    handleConversationSelect,
    handleNewChat,
    handleKeyDown
  };
}
