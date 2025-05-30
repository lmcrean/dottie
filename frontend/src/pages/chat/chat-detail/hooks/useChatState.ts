import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { sendMessage } from '../components/buttons/send-message';
import { ConversationListItem, ApiMessage } from '../../types';
import { Message } from '../types/chat';
import { apiClient } from '../../../../api/core/apiClient';
import axios from 'axios';

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
  assessmentId: string | null;
}

// Helper function to fetch conversation from backend
const fetchConversation = async (
  conversationId: string
): Promise<{ id: string; messages: ApiMessage[]; assessment_id?: string } | null> => {
  try {
    // Ensure conversationId is a string
    const conversationIdString = String(conversationId);

    const response = await apiClient.get(`/api/chat/history/${conversationIdString}`);

    return response.data;
  } catch (error) {
    // Handle 404 errors specifically - conversation not found
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    console.error('Error fetching conversation:', error);
    throw error;
  }
};

export function useChatState({ chatId, initialMessage }: UseChatStateProps): UseChatStateReturn {
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Ensure chatId is a string if it exists, otherwise null
  const initialChatId = chatId ? String(chatId) : null;
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(initialChatId);

  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const hasSentInitialMessage = useRef(false);

  // Load existing conversation if chatId is provided
  useEffect(() => {
    if (chatId) {
      const loadExistingConversation = async () => {
        try {
          setIsLoading(true);
          // Ensure chatId is a string
          const chatIdString = String(chatId);
          console.log(`Loading conversation with ID: ${chatIdString}`);

          const fullConversation = await fetchConversation(chatIdString);

          if (fullConversation) {
            const convertedMessages = fullConversation.messages.map((msg: ApiMessage) => ({
              role: msg.role,
              content: msg.content,
              created_at: msg.created_at
            }));
            setMessages(convertedMessages);
            setCurrentConversationId(chatIdString);

            // Ensure assessment_id is a string if it exists
            const assessmentIdString = fullConversation.assessment_id
              ? String(fullConversation.assessment_id)
              : null;

            setAssessmentId(assessmentIdString);
          } else {
            // Conversation not found
            console.warn(`Conversation ${chatIdString} not found`);
            setCurrentConversationId(null);
            setMessages([]);
          }
        } catch (error) {
          console.error('Error loading conversation:', error);
          toast.error('Failed to load conversation');
          setCurrentConversationId(null);
          setMessages([]);
        } finally {
          setIsLoading(false);
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

    // Ensure currentConversationId is a string
    const conversationIdString = String(currentConversationId);

    const userMessage = textToSend;
    setInput('');
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: userMessage,
        created_at: new Date().toISOString()
      }
    ]);
    setIsLoading(true);

    try {
      const response = await sendMessage({
        chat_id: conversationIdString,
        message: userMessage,
        conversationId: conversationIdString
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.content,
          created_at: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I apologize, but I'm having trouble processing your request right now. Please try again later.",
          created_at: new Date().toISOString()
        }
      ]);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversationSelect = async (conversation: ConversationListItem) => {
    try {
      setIsLoading(true);

      // Ensure conversation.id is a string
      const conversationIdString = String(conversation.id);

      const fullConversation = await fetchConversation(conversationIdString);

      if (fullConversation) {
        const convertedMessages = fullConversation.messages.map((msg: ApiMessage) => ({
          role: msg.role,
          content: msg.content,
          created_at: msg.created_at
        }));

        setMessages(convertedMessages);
        setCurrentConversationId(conversationIdString);

        // Ensure assessment_id is a string if it exists
        const assessmentIdString = fullConversation.assessment_id
          ? String(fullConversation.assessment_id)
          : null;

        setAssessmentId(assessmentIdString);

        // Navigate to the chat detail page
        navigate(`/chat/${conversationIdString}`);
      } else {
        toast.error('Failed to load conversation');
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      toast.error('Failed to load conversation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setCurrentConversationId(null);
    setMessages([]);
    setInput('');
    setAssessmentId(null);
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
    handleKeyDown,
    assessmentId
  };
}
