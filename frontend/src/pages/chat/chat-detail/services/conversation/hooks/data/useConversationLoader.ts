import React, { useState, useEffect, useCallback } from 'react';
import { conversationApi } from '../../api';
import { ApiMessage, AssessmentData } from '../../../../../types';
import { Message } from '../../../../types';

interface UseConversationLoaderProps {
  conversationId?: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setCurrentConversationId: React.Dispatch<React.SetStateAction<string | null>>;
  setAssessmentId: React.Dispatch<React.SetStateAction<string | null>>;
  setAssessmentObject: React.Dispatch<React.SetStateAction<AssessmentData | null>>;
  currentConversationId: string | null;
}

interface UseConversationLoaderReturn {
  isLoading: boolean;
  loadConversation: (conversationId: string) => Promise<boolean>;
}

export function useConversationLoader({
  conversationId,
  setMessages,
  setCurrentConversationId,
  setAssessmentId,
  setAssessmentObject,
  currentConversationId
}: UseConversationLoaderProps): UseConversationLoaderReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedConversation, setHasLoadedConversation] = useState<string | null>(null);

  const loadConversation = useCallback(async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log(`[useConversationLoader] Loading conversation: ${id}`);

      const fullConversation = await conversationApi.fetchConversation(id);

      if (fullConversation) {
        console.log(`[useConversationLoader] Conversation loaded successfully, messages count: ${fullConversation.messages.length}`);
        
        const convertedMessages = fullConversation.messages.map((msg: ApiMessage) => ({
          role: msg.role,
          content: msg.content,
          created_at: msg.created_at
        }));

        setMessages(convertedMessages);
        setCurrentConversationId(id);
        setHasLoadedConversation(id);

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
  }, [setMessages, setCurrentConversationId, setAssessmentId, setAssessmentObject]);

  // Load conversation when conversationId prop changes
  useEffect(() => {
    if (conversationId && conversationId !== hasLoadedConversation) {
      console.log(`[useConversationLoader] useEffect triggered - conversationId: ${conversationId}, hasLoadedConversation: ${hasLoadedConversation}`);
      loadConversation(conversationId);
    }
  }, [conversationId, hasLoadedConversation, loadConversation]);

  return {
    isLoading,
    loadConversation
  };
} 