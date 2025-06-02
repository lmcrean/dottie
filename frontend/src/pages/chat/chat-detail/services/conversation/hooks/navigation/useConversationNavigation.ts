import { useNavigate } from 'react-router-dom';
import { ConversationListItem } from '../../../../../types';

/**
 * Hook for managing navigation between individual conversation threads
 * Handles conversation selection, creating new chats, and URL navigation
 */

interface UseConversationNavigationProps {
  onConversationLoad?: (conversationId: string) => Promise<boolean>;
  onConversationClear?: () => void;
}

interface UseConversationNavigationReturn {
  handleConversationSelect: (conversation: ConversationListItem) => void;
  handleNewChat: () => void;
  navigateToConversation: (conversationId: string) => void;
  navigateToChat: () => void;
}

export function useConversationNavigation({
  onConversationLoad,
  onConversationClear
}: UseConversationNavigationProps): UseConversationNavigationReturn {
  const navigate = useNavigate();

  const navigateToConversation = (conversationId: string) => {
    console.log(`[useConversationNavigation] Navigating to conversation: ${conversationId}`);
    navigate(`/chat/${conversationId}`, { replace: false });
  };

  const navigateToChat = () => {
    console.log(`[useConversationNavigation] Navigating to chat home`);
    navigate('/chat', { replace: false });
  };

  const handleConversationSelect = (conversation: ConversationListItem) => {
    const conversationId = String(conversation.id);
    console.log(`[useConversationNavigation] Conversation selected: ${conversationId}`);

    if (onConversationLoad) {
      onConversationLoad(conversationId).catch((error) => {
        console.error('[useConversationNavigation] Failed to load conversation:', error);
      });
    }
  };

  const handleNewChat = () => {
    console.log(`[useConversationNavigation] New chat requested`);

    if (onConversationClear) {
      onConversationClear();
    }
  };

  return {
    handleConversationSelect,
    handleNewChat,
    navigateToConversation,
    navigateToChat
  };
}
