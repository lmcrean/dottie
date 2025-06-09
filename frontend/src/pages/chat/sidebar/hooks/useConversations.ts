import { useState, useEffect, MouseEvent, useCallback } from 'react';
import { getConversationsList } from '../api/get-list';
import { deleteConversation } from '../api/delete-conversation';
import { ConversationListItem } from '../../types';

export function useConversations(selectedConversationId?: string, onNewChat?: () => void) {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getConversationsList();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load conversations on mount and when selectedConversationId changes
  useEffect(() => {
    loadConversations();
  }, [loadConversations, selectedConversationId]);

  const handleDeleteConversation = async (conversationId: string, e: MouseEvent) => {
    e.stopPropagation(); // Prevent conversation selection when clicking delete

    try {
      setDeletingId(conversationId);
      await deleteConversation(conversationId);

      // Update conversations list immediately
      setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));

      // If the deleted conversation was selected, trigger new chat
      if (selectedConversationId === conversationId && onNewChat) {
        onNewChat();
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      // Reload conversations list on error to ensure consistency
      loadConversations();
    } finally {
      setDeletingId(null);
    }
  };

  return {
    conversations,
    loading,
    deletingId,
    loadConversations,
    handleDeleteConversation
  };
}
