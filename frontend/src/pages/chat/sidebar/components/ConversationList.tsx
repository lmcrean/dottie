import React from 'react';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { Button } from '@/src/components/buttons/button';
import { MessageSquare } from 'lucide-react';
import { ConversationListItem } from '../../types';
import { ConversationItem } from './ConversationItem';

interface ConversationListProps {
  conversations: ConversationListItem[];
  loading: boolean;
  selectedConversationId?: string;
  deletingId: string | null;
  onConversationSelect: (conversation: ConversationListItem) => void;
  onDeleteConversation: (conversationId: string, e: React.MouseEvent) => void;
  onNewChat: () => void;
}

export function ConversationList({
  conversations,
  loading,
  selectedConversationId,
  deletingId,
  onConversationSelect,
  onDeleteConversation,
  onNewChat
}: ConversationListProps) {
  if (loading) {
    return (
      <ScrollArea className="flex-1">
        <div className="p-2">
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-500">Loading conversations...</div>
          </div>
        </div>
      </ScrollArea>
    );
  }

  if (conversations.length === 0) {
    return (
      <ScrollArea className="flex-1">
        <div className="p-2">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquare className="mb-2 h-12 w-12 text-gray-300" />
            <div className="text-sm text-gray-500">No conversations yet</div>
          </div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-2">
        <div className="space-y-1">
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedConversationId === conversation.id}
              isDeleting={deletingId === conversation.id}
              onSelect={onConversationSelect}
              onDelete={onDeleteConversation}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
