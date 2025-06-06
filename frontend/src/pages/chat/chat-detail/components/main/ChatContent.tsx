import React from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from '../footer/ChatInput';
import { AssessmentDataDisplay } from '../footer/AssessmentDataDisplay';
import { ApiMessage, AssessmentData } from '../../../types';

interface ChatContentProps {
  messages: ApiMessage[];
  isLoading: boolean;
  currentConversationId?: string;
  assessmentId?: string;
  assessmentObject?: AssessmentData;
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onAssessmentError: (error: string) => void;
}

export function ChatContent({
  messages,
  isLoading,
  currentConversationId,
  assessmentId,
  assessmentObject,
  input,
  setInput,
  onSend,
  onKeyDown,
  onAssessmentError
}: ChatContentProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MessageList messages={messages} isLoading={isLoading} />

      {currentConversationId ? (
        <>
          {/* Assessment Data Display - above chat input */}
          <AssessmentDataDisplay
            assessmentId={assessmentId}
            assessmentObject={assessmentObject}
            onError={onAssessmentError}
          />

          <ChatInput
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            onSend={onSend}
            onKeyDown={onKeyDown}
          />
        </>
      ) : (
        <div className="border-t bg-gray-50 p-4 text-center text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          <p>
            No active conversation. Please start a new chat from the assessment page to continue.
          </p>
        </div>
      )}
    </div>
  );
}
