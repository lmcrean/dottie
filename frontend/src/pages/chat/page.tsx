import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatSidebar from './sidebar/ChatSidebar';
import { ChatDetail } from './chat-detail/ChatDetail';
import { ConversationListItem } from './types';
import { SidebarToggle } from './sidebar/components';

const ChatPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const [sidebarRefresh, setSidebarRefresh] = useState<(() => Promise<void>) | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Callback to receive the loadConversations function from ChatSidebar
  const handleSidebarUpdate = useCallback((refreshFunction: () => Promise<void>) => {
    setSidebarRefresh(() => refreshFunction);
  }, []);

  // Handle conversation selection from sidebar
  const handleConversationSelect = useCallback(
    (conversation: ConversationListItem) => {
      console.log('[ChatPage] Conversation selected:', conversation.id);
      console.log('🔍 Current location before navigate:', window.location.href);

      // Use React Router navigation instead of window.location
      const targetUrl = `/chat/${conversation.id}`;
      console.log('🚀 Using navigate to:', targetUrl);
      navigate(targetUrl);
    },
    [navigate]
  );

  // Handle new chat request
  const handleNewChat = useCallback(() => {
    console.log('[ChatPage] New chat requested');
    console.log('🚀 Using navigate to: /chat');
    navigate('/chat');
  }, [navigate]);

  // Handle sidebar toggle
  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`h-full transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-80' : 'w-0'
        } overflow-hidden border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800`}
      >
        <ChatSidebar
          selectedConversationId={conversationId}
          onSidebarUpdate={handleSidebarUpdate}
          onConversationSelect={handleConversationSelect}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        {/* Sidebar Toggle Button */}
        <div className="flex items-center border-b bg-gradient-to-r from-pink-50 to-white p-2 dark:from-gray-900 dark:to-black">
          <SidebarToggle
            isOpen={isSidebarOpen}
            onToggle={handleToggleSidebar}
            className="mr-2"
            showCloseIcon={true}
          />
          <h1 className="text-lg font-bold text-pink-600">Chat with Dottie</h1>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {conversationId ? (
            <ChatDetail chatId={conversationId} onSidebarRefresh={sidebarRefresh || undefined} />
          ) : (
            /* Empty state */
            <div className="flex h-full flex-1 items-center justify-center">
              <div className="text-center">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                  Welcome to Chat with Dottie
                </h3>
                <p className="mb-4 text-gray-500 dark:text-gray-400">
                  Select a conversation from the sidebar or start a new chat from your assessment
                  results.
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  No active conversation selected
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
