import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { Button } from '@/src/components/buttons/button';
import { MessageSquare, Trash2, Plus, Calendar } from 'lucide-react';
import { getConversationsList } from './api';
import { deleteConversation } from '../api/message/requests/deleteConversation';
import { ConversationListItem } from '../api/message/utils/types';

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
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversationsList();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent conversation selection when clicking delete

    try {
      setDeletingId(conversationId);
      await deleteConversation(conversationId);
      setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));

      // If the deleted conversation was selected, trigger new chat
      if (selectedConversationId === conversationId) {
        onNewChat();
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return 'Unknown date';
    }

    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string provided to formatDate:', dateString);
      return 'Invalid date';
    }

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const truncatePreview = (text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="flex h-full w-80 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-pink-50 to-white p-4 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat History</h2>
          <Button
            onClick={onNewChat}
            size="sm"
            className="rounded-full bg-pink-600 text-white hover:bg-pink-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-gray-500">Loading conversations...</div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquare className="mb-2 h-12 w-12 text-gray-300" />
              <div className="mb-2 text-sm text-gray-500">No conversations yet</div>
              <Button
                onClick={onNewChat}
                size="sm"
                variant="outline"
                className="border-pink-200 text-pink-600 hover:bg-pink-50"
              >
                Start a new chat
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => onConversationSelect(conversation)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onConversationSelect(conversation);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className={`group relative cursor-pointer rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${selectedConversationId === conversation.id ? 'border border-pink-200 bg-pink-50 dark:border-pink-800 dark:bg-pink-900/20' : 'border border-transparent'}`}
                >
                  {/* Conversation Content */}
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <MessageSquare className="h-3 w-3 flex-shrink-0 text-pink-600" />
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(conversation.last_message_date)}</span>
                        </div>
                      </div>
                      <div className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
                        {truncatePreview(conversation.preview, 50)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {conversation.message_count} message
                        {conversation.message_count !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteConversation(conversation.id, e)}
                      disabled={deletingId === conversation.id}
                      className="h-6 w-6 p-0 opacity-0 transition-opacity hover:bg-red-100 hover:text-red-600 group-hover:opacity-100"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Selected Indicator */}
                  {selectedConversationId === conversation.id && (
                    <div className="absolute bottom-0 left-0 top-0 w-1 rounded-r bg-pink-600"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        <div className="text-center text-xs text-gray-500">
          {conversations.length} conversation{conversations.length !== 1 ? 's' : ''} total
        </div>
      </div>
    </div>
  );
}
