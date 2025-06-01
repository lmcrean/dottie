import React, { useState } from 'react';
import { useChatState } from './hooks/useChatState';
import { ChatHeader } from './components/ChatHeader';
import { MobileSidebarOverlay } from './components/MobileSidebarOverlay';
import { ChatContent } from './components/ChatContent';
import { toast } from 'sonner';

interface ChatDetailProps {
  chatId?: string;
  initialMessage?: string;
  onSidebarRefresh?: () => Promise<void>;
}

export function ChatDetail({ chatId, initialMessage, onSidebarRefresh }: ChatDetailProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
  } = useChatState({ chatId: chatIdString, initialMessage, onSidebarRefresh });

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAssessmentError = (error: string) => {
    toast.error(error);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white dark:bg-gray-900">
      <MobileSidebarOverlay
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentConversationId={currentConversationId || undefined}
        onConversationSelect={handleConversationSelect}
        onNewChat={handleNewChat}
      />

      {/* Main Chat Area */}
      <div className="flex min-h-screen flex-1 flex-col">
        <ChatHeader
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={handleToggleSidebar}
          showSidebarToggle={true}
          showCloseButton={false}
        />

        <ChatContent
          messages={messages}
          isLoading={isLoading}
          currentConversationId={currentConversationId || undefined}
          assessmentId={assessmentId || undefined}
          assessmentObject={assessmentObject || undefined}
          input={input}
          setInput={setInput}
          onSend={handleSend}
          onKeyDown={handleKeyDown}
          onAssessmentError={handleAssessmentError}
        />
      </div>
    </div>
  );
}
