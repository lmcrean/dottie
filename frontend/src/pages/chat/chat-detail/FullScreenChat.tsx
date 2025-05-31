import React, { useState } from 'react';
import { ChatSidebar } from '../sidebar';
import { useChatState } from './hooks/useChatState';
import { ChatHeader } from './components/ChatHeader';
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';
import { AssessmentDataDisplay } from './components/AssessmentDataDisplay';
import { toast } from 'sonner';

interface ChatInterfaceProps {
  chatId?: string;
  initialMessage?: string;
}

export function FullscreenChat({ chatId, initialMessage }: ChatInterfaceProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed since sidebar is handled by page

  // Ensure chatId is a string if it exists
  const chatIdString = chatId ? String(chatId) : undefined;

  const {
    messages,
    input,
    setInput,
    isLoading,
    currentConversationId,
    handleSend,
    handleConversationSelect,
    handleNewChat,
    handleKeyDown,
    assessmentId,
    assessmentObject
  } = useChatState({ chatId: chatIdString, initialMessage });

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAssessmentError = (error: string) => {
    toast.error(error);
  };

  return (
    <div className="flex h-full w-full bg-white dark:bg-gray-900">
      {/* Optional sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div className="absolute inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsSidebarOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsSidebarOpen(false);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Close sidebar"
          />
          <div className="relative z-50 h-full w-80">
            <ChatSidebar
              onConversationSelect={handleConversationSelect}
              onNewChat={handleNewChat}
              selectedConversationId={currentConversationId || undefined}
            />
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex h-full flex-1 flex-col">
        <ChatHeader
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={handleToggleSidebar}
          showSidebarToggle={true} // Show toggle for mobile
          showCloseButton={false} // No close button needed in routed context
        />

        <div className="flex min-h-0 flex-1 flex-col">
          <MessageList messages={messages} isLoading={isLoading} />

          {currentConversationId ? (
            <>
              {/* Assessment Data Display - above chat input */}
              <AssessmentDataDisplay
                assessmentId={assessmentId || undefined}
                assessmentObject={assessmentObject}
                onError={handleAssessmentError}
              />

              <ChatInput
                input={input}
                setInput={setInput}
                isLoading={isLoading}
                onSend={() => handleSend()}
                onKeyDown={handleKeyDown}
              />
            </>
          ) : (
            <div className="border-t bg-gray-50 p-4 text-center text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              <p>
                No active conversation. Please start a new chat from the assessment page to
                continue.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
