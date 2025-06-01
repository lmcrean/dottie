import React, { useCallback } from 'react';
import ChatSidebar from './sidebar/ChatSidebar';

const ChatPage: React.FC = () => {
  // Callback to receive the loadConversations function from ChatSidebar
  const handleSidebarUpdate = useCallback((refreshFunction: () => Promise<void>) => {
    // Store the refresh function for potential future use
    console.log('Sidebar update function received:', refreshFunction);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <ChatSidebar onSidebarUpdate={handleSidebarUpdate} />
      </div>

      {/* Main chat area - empty state */}
      <div className="flex flex-1 items-center justify-center">
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
            Select a conversation from the sidebar or start a new chat from your assessment results.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            No active conversation selected
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
