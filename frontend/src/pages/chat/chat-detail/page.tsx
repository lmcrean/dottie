import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ChatSidebar from '../sidebar/ChatSidebar';
import { FullscreenChat } from './FullScreenChat';

const ChatDetailPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [sidebarRefresh, setSidebarRefresh] = useState<(() => Promise<void>) | null>(null);

  // Callback to receive the loadConversations function from ChatSidebar
  const handleSidebarUpdate = useCallback((refreshFunction: () => Promise<void>) => {
    setSidebarRefresh(() => refreshFunction);
  }, []);

  if (!conversationId) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-80 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <ChatSidebar onSidebarUpdate={handleSidebarUpdate} />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
              Invalid Conversation
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Please select a valid conversation from the sidebar.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <ChatSidebar selectedConversationId={conversationId} onSidebarUpdate={handleSidebarUpdate} />
      </div>

      {/* Chat Detail */}
      <div className="flex-1">
        <FullscreenChat chatId={conversationId} onSidebarRefresh={sidebarRefresh || undefined} />
      </div>
    </div>
  );
};

export default ChatDetailPage;
