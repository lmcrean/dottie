import React, { useState } from 'react';
import { ChatSidebar } from '../sidebar';
import { useChatState } from './hooks/useChatState';
import { ChatHeader } from './components/ChatHeader';
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';
import { AssessmentDataDisplay } from './components/AssessmentDataDisplay';
import { FullscreenChatProps } from './types/chat';
import { toast } from 'sonner';

export function FullscreenChat({
  onClose,
  initialMessage,
  setIsFullscreen,
  chatId
}: FullscreenChatProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    assessmentId
  } = useChatState({ chatId: chatIdString, initialMessage });

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMinimize = () => {
    setIsFullscreen(false);
  };

  const handleAssessmentError = (error: string) => {
    toast.error(error);
  };

  return (
    <div className="fixed inset-0 z-50 flex w-full bg-white dark:bg-gray-900">
      <div className="container mx-auto flex h-full max-w-7xl border border-gray-200 shadow-lg dark:border-slate-800">
        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="border-r border-gray-200 dark:border-gray-700">
            <ChatSidebar
              onConversationSelect={handleConversationSelect}
              onNewChat={handleNewChat}
              selectedConversationId={currentConversationId || undefined}
            />
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex flex-1 flex-col">
          <ChatHeader
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={handleToggleSidebar}
            onMinimize={handleMinimize}
            onClose={onClose}
          />

          <div className="flex flex-1 flex-col">
            <MessageList messages={messages} isLoading={isLoading} />

            {currentConversationId ? (
              <>
                {/* Assessment Data Display - above chat input */}
                <AssessmentDataDisplay
                  assessmentId={assessmentId || undefined}
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
    </div>
  );
}
