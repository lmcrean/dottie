import React from 'react';
import { ConversationListItem } from '../types';
import { useConversations } from './hooks/useConversations';
import { SidebarHeader, ConversationList, SidebarFooter } from './components';

interface ChatSidebarProps {
  onConversationSelect: (conversation: ConversationListItem) => void;
  onNewChat: () => void;
  selectedConversationId?: string;
}

export function ChatSidebar({
  onConversationSelect,
  onNewChat,
  selectedConversationId
}: ChatSidebarProps) {
  const { conversations, loading, deletingId, handleDeleteConversation } = useConversations(
    selectedConversationId,
    onNewChat
  );

  return (
    <div className="flex h-full w-80 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <SidebarHeader onNewChat={onNewChat} />

      <ConversationList
        conversations={conversations}
        loading={loading}
        selectedConversationId={selectedConversationId}
        deletingId={deletingId}
        onConversationSelect={onConversationSelect}
        onDeleteConversation={handleDeleteConversation}
        onNewChat={onNewChat}
      />

      <SidebarFooter conversations={conversations} />
    </div>
  );
}
