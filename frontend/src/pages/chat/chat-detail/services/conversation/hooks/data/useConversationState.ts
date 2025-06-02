import React, { useState } from 'react';
import { Message } from '../../../../types';
import { AssessmentData } from '../../../../../types';

interface UseConversationStateProps {
  initialConversationId?: string;
}

interface UseConversationStateReturn {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  currentConversationId: string | null;
  setCurrentConversationId: React.Dispatch<React.SetStateAction<string | null>>;
  assessmentId: string | null;
  setAssessmentId: React.Dispatch<React.SetStateAction<string | null>>;
  assessmentObject: AssessmentData | null;
  setAssessmentObject: React.Dispatch<React.SetStateAction<AssessmentData | null>>;
  clearConversation: () => void;
}

export function useConversationState({
  initialConversationId
}: UseConversationStateProps): UseConversationStateReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(
    initialConversationId ? String(initialConversationId) : null
  );
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [assessmentObject, setAssessmentObject] = useState<AssessmentData | null>(null);

  const clearConversation = () => {
    setMessages([]);
    setCurrentConversationId(null);
    setAssessmentId(null);
    setAssessmentObject(null);
  };

  return {
    messages,
    setMessages,
    currentConversationId,
    setCurrentConversationId,
    assessmentId,
    setAssessmentId,
    assessmentObject,
    setAssessmentObject,
    clearConversation
  };
} 