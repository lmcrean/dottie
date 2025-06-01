import { useNavigate } from 'react-router-dom';
import { ConversationListItem } from '../../types';

interface UseChatNavigationProps {
  onConversationLoad?: (conversationId: string) => Promise<boolean>;
  onConversationClear?: () => void;
}

interface UseChatNavigationReturn {
  handleConversationSelect: (conversation: ConversationListItem) => void;
  handleNewChat: () => void;
  navigateToConversation: (conversationId: string) => void;
  navigateToChat: () => void;
}

export function useChatNavigation({
  onConversationLoad,
  onConversationClear
}: UseChatNavigationProps): UseChatNavigationReturn {
  const navigate = useNavigate();

  const navigateToConversation = (conversationId: string) => {
    console.log(`[useChatNavigation] Navigating to conversation: ${conversationId}`);
    navigate(`/chat/${conversationId}`, { replace: false });
  };

  const navigateToChat = () => {
    console.log(`[useChatNavigation] Navigating to chat home`);
    navigate('/chat', { replace: false });
  };

  const handleConversationSelect = (conversation: ConversationListItem) => {
    const conversationId = String(conversation.id);
    console.log(`[useChatNavigation] Conversation selected: ${conversationId}`);

    if (onConversationLoad) {
      onConversationLoad(conversationId).catch((error) => {
        console.error('[useChatNavigation] Failed to load conversation:', error);
      });
    }
  };

  const handleNewChat = () => {
    console.log(`[useChatNavigation] New chat requested`);

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
