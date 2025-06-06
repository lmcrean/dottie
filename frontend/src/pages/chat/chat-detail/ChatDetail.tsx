import React, { useState } from 'react';
import { useConversationPageState } from './services/conversation/hooks/useConversationPageState';
import { ChatHeader } from './components/header/ChatHeader';
import { MobileSidebarOverlay } from './components/header/MobileSidebarOverlay';
import { ChatContent } from './components/main/ChatContent';
import { toast } from 'sonner';

interface ChatDetailProps {
  chatId?: string;
  initialMessage?: string;
  onSidebarRefresh?: () => Promise<void>;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export function ChatDetail({
  chatId,
  initialMessage,
  onSidebarRefresh,
  isSidebarOpen: externalSidebarOpen,
  onToggleSidebar: externalToggleSidebar
}: ChatDetailProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Ensure chatId is a string if it exists
  const chatIdString = chatId ? String(chatId) : undefined;

  const {
    messages,
    input,
    setInput,
    isLoading,
    currentConversationId,
    sendFromInput,
    handleConversationSelect,
    handleNewChat,
    handleKeyDown,
    assessmentId,
    assessmentObject
  } = useConversationPageState({ chatId: chatIdString, initialMessage, onSidebarRefresh });

  const handleToggleSidebar = () => {
    if (externalToggleSidebar) {
      externalToggleSidebar();
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const handleAssessmentError = (error: string) => {
    toast.error(error);
  };

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-gray-900">
      <MobileSidebarOverlay
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentConversationId={currentConversationId || undefined}
        onConversationSelect={handleConversationSelect}
        onNewChat={handleNewChat}
      />

      {/* Main Chat Area */}
      <div className="flex h-full flex-1 flex-col">
        {' '}
        <ChatHeader
          isSidebarOpen={externalSidebarOpen !== undefined ? externalSidebarOpen : isSidebarOpen}
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
          onSend={sendFromInput}
          onKeyDown={handleKeyDown}
          onAssessmentError={handleAssessmentError}
        />
      </div>
    </div>
  );
}
