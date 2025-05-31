import React from 'react';
import { ConversationListItem } from '../../types';

interface SidebarFooterProps {
  conversations: ConversationListItem[];
}

export function SidebarFooter({ conversations }: SidebarFooterProps) {
  const totalConversations = conversations.length;
  const conversationsWithPatterns = conversations.filter((conv) => conv.assessment_pattern).length;

  return (
    <div className="border-t border-gray-200 p-4 dark:border-gray-700">
      <div className="text-center text-xs text-gray-500">
        {totalConversations} conversation{totalConversations !== 1 ? 's' : ''} total
      </div>
    </div>
  );
}
