import React from 'react';
import { ChatSidebar } from '../../../sidebar';
import { ConversationListItem } from '../../../types';

interface MobileSidebarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currentConversationId?: string;
  onConversationSelect: (conversation: ConversationListItem) => void;
  onNewChat: () => void;
}

export function MobileSidebarOverlay({
  isOpen,
  onClose,
  currentConversationId,
  onConversationSelect,
  onNewChat
}: MobileSidebarOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-40 md:hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClose();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Close sidebar"
      />
      <div className="relative z-30 h-full w-80">
        <ChatSidebar
          onConversationSelect={onConversationSelect}
          onNewChat={onNewChat}
          selectedConversationId={currentConversationId}
        />
      </div>
    </div>
  );
}
