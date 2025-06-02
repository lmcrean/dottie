import { useConversationState } from './useConversationState';
import { useConversationLoader } from './useConversationLoader';
import { AssessmentData } from '../../../../../types';
import { Message } from '../../../../types';

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

export function useConversationData({
  conversationId
}: UseConversationDataProps): UseConversationDataReturn {
  // State management
  const conversationState = useConversationState({
    initialConversationId: conversationId
  });

  // Loading logic
  const { isLoading, loadConversation } = useConversationLoader({
    conversationId,
    setMessages: conversationState.setMessages,
    setCurrentConversationId: conversationState.setCurrentConversationId,
    setAssessmentId: conversationState.setAssessmentId,
    setAssessmentObject: conversationState.setAssessmentObject,
    currentConversationId: conversationState.currentConversationId
  });

  return {
    ...conversationState,
    isLoading,
    loadConversation
  };
}
