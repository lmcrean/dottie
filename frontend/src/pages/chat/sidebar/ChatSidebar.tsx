import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConversationListItem } from '../types';
import { useConversations } from './hooks/useConversations';
import { SidebarHeader, ConversationList, SidebarFooter } from './components';

interface ChatSidebarProps {
  selectedConversationId?: string;
  onConversationSelect?: (conversation: ConversationListItem) => void;
  onNewChat?: () => void;
  onSidebarUpdate?: (refreshFunction: () => Promise<void>) => void;
}

export function ChatSidebar({
  selectedConversationId,
  onConversationSelect,
  onNewChat,
  onSidebarUpdate
}: ChatSidebarProps) {
  const navigate = useNavigate();

  const handleConversationSelect = useCallback(
    (conversation: ConversationListItem) => {
      if (onConversationSelect) {
        // Use callback if provided (for embedded use)
        onConversationSelect(conversation);
      } else {
        // Use navigation for standalone use
        navigate(`/chat/${conversation.id}`);
      }
    },
    [navigate, onConversationSelect]
  );

  const handleNewChat = useCallback(() => {
    if (onNewChat) {
      // Use callback if provided (for embedded use)
      onNewChat();
    } else {
      // Use navigation for standalone use
      navigate('/chat');
    }
  }, [navigate, onNewChat]);

  const { conversations, loading, deletingId, loadConversations, handleDeleteConversation } =
    useConversations(selectedConversationId, handleNewChat);

  // Expose loadConversations function to parent components
  useEffect(() => {
    if (onSidebarUpdate) {
      onSidebarUpdate(loadConversations);
    }
  }, [onSidebarUpdate, loadConversations]);

  return (
    <div className="flex h-full w-80 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <SidebarHeader onNewChat={handleNewChat} />

      <ConversationList
        conversations={conversations}
        loading={loading}
        selectedConversationId={selectedConversationId}
        deletingId={deletingId}
        onConversationSelect={handleConversationSelect}
        onDeleteConversation={handleDeleteConversation}
        onNewChat={handleNewChat}
      />

      <SidebarFooter conversations={conversations} />
    </div>
  );
}

// Also export as default for easier importing
export default ChatSidebar;
