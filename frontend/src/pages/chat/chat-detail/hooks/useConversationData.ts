import React, { useState, useEffect } from 'react';
import { ApiMessage, AssessmentData } from '../../types';
import { Message } from '../types/chat';
import { apiClient } from '../../../../api/core/apiClient';
import axios from 'axios';

interface UseConversationDataProps {
  conversationId?: string;
}

interface UseConversationDataReturn {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  currentConversationId: string | null;
  setCurrentConversationId: React.Dispatch<React.SetStateAction<string | null>>;
  assessmentId: string | null;
  setAssessmentId: React.Dispatch<React.SetStateAction<string | null>>;
  assessmentObject: AssessmentData | null;
  setAssessmentObject: React.Dispatch<React.SetStateAction<AssessmentData | null>>;
  isLoading: boolean;
  loadConversation: (conversationId: string) => Promise<boolean>;
  clearConversation: () => void;
}

// Helper function to fetch conversation from backend
const fetchConversation = async (
  conversationId: string
): Promise<{
  id: string;
  messages: ApiMessage[];
  assessment_id?: string;
  assessment_object?: AssessmentData;
} | null> => {
  try {
    const conversationIdString = String(conversationId);
    const response = await apiClient.get(`/api/chat/history/${conversationIdString}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error('Error fetching conversation:', error);
    throw error;
  }
};

export function useConversationData({
  conversationId
}: UseConversationDataProps): UseConversationDataReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(
    conversationId ? String(conversationId) : null
  );
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [assessmentObject, setAssessmentObject] = useState<AssessmentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadConversation = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log(`[useConversationData] Loading conversation: ${id}`);

      const fullConversation = await fetchConversation(id);

      if (fullConversation) {
        const convertedMessages = fullConversation.messages.map((msg: ApiMessage) => ({
          role: msg.role,
          content: msg.content,
          created_at: msg.created_at
        }));

        setMessages(convertedMessages);
        setCurrentConversationId(id);

        const assessmentIdString = fullConversation.assessment_id
          ? String(fullConversation.assessment_id)
          : null;
        setAssessmentId(assessmentIdString);

        if (fullConversation.assessment_object) {
          try {
            const assessmentObj =
              typeof fullConversation.assessment_object === 'string'
                ? JSON.parse(fullConversation.assessment_object)
                : fullConversation.assessment_object;
            setAssessmentObject(assessmentObj);
          } catch (error) {
            console.warn('Failed to parse assessment_object:', error);
            setAssessmentObject(fullConversation.assessment_object);
          }
        } else {
          setAssessmentObject(null);
        }

        return true;
      } else {
        console.warn(`Conversation ${id} not found`);
        return false;
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setCurrentConversationId(null);
    setAssessmentId(null);
    setAssessmentObject(null);
  };

  // Load conversation when conversationId prop changes
  useEffect(() => {
    if (conversationId && conversationId !== currentConversationId) {
      loadConversation(conversationId);
    }
  }, [conversationId, currentConversationId]);

  return {
    messages,
    setMessages,
    currentConversationId,
    setCurrentConversationId,
    assessmentId,
    setAssessmentId,
    assessmentObject,
    setAssessmentObject,
    isLoading,
    loadConversation,
    clearConversation
  };
}
