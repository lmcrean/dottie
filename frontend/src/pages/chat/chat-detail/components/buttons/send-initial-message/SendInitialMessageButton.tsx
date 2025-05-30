import React, { useState } from 'react';
import { Button } from '@/src/components/buttons/button';
import { MessageCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { FullscreenChat } from '../../../FullScreenChat';
import { createNewChat } from '../../../../sidebar/api/create-new/api/createNewChat';
import { sendInitialMessage } from './api/sendInitialMessage';
import { PATTERN_DATA } from '../../../../../assessment/steps/context/types/recommendations';
import { MenstrualPattern } from '../../../../../assessment/steps/context/types';

interface SendInitialMessageButtonProps {
  assessmentId?: string;
  pattern?: MenstrualPattern;
  className?: string;
  disabled?: boolean;
}

export function SendInitialMessageButton({
  assessmentId,
  pattern = 'regular',
  className = '',
  disabled = false
}: SendInitialMessageButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreenChatOpen, setIsFullscreenChatOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const handleStartChat = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);

    try {
      // Generate initial message based on assessment
      const initialMessage = assessmentId
        ? `Hi! I've just completed my menstrual health assessment (ID: ${assessmentId}). My results show: ${PATTERN_DATA[pattern].title}. Can you tell me more about what this means and provide personalized recommendations?`
        : `Hi! I've just completed my menstrual health assessment. My results show: ${PATTERN_DATA[pattern].title}. Can you tell me more about what this means?`;

      // Log button click
      console.log(
        `[SendInitialMessageButton] Start chat clicked with assessmentId: ${assessmentId}, type: ${typeof assessmentId}`
      );
      console.log(`[SendInitialMessageButton] Initial message: "${initialMessage}"`);

      // Ensure assessmentId is a string if it exists
      const assessmentIdString = assessmentId ? String(assessmentId) : undefined;

      // Log before API call
      console.log(
        `[SendInitialMessageButton] Creating new chat with assessment_id: ${assessmentIdString}, type: ${typeof assessmentIdString}`
      );

      // Create new chat
      const newChat = await createNewChat({
        assessment_id: assessmentIdString,
        initial_message: initialMessage
      });

      // Ensure newChat.id is a string
      const chatIdString = String(newChat.id);
      setCurrentChatId(chatIdString);

      // Log after API response
      console.log(
        `[SendInitialMessageButton] Chat created successfully, received ID: ${newChat.id}, type: ${typeof newChat.id}`
      );
      console.log(
        `[SendInitialMessageButton] Converted chat ID: ${chatIdString}, type: ${typeof chatIdString}`
      );

      // Send initial message if we have an assessment ID
      if (assessmentIdString) {
        // Log before sending initial message
        console.log(
          `[SendInitialMessageButton] Sending initial message to chat ${chatIdString}, with assessment ${assessmentIdString}`
        );
        console.log(`[SendInitialMessageButton] Request payload:`, {
          chat_id: chatIdString,
          assessment_id: assessmentIdString,
          message: initialMessage
        });

        await sendInitialMessage({
          chat_id: chatIdString,
          assessment_id: assessmentIdString,
          message: initialMessage
        });
      }

      // Open fullscreen chat
      setIsFullscreenChatOpen(true);
    } catch (error) {
      console.error('[SendInitialMessageButton] Error starting chat:', error);
      toast.error('Failed to start chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseChat = () => {
    setIsFullscreenChatOpen(false);
    setCurrentChatId(null);
  };

  return (
    <>
      <Button
        className={`flex items-center justify-center gap-2 bg-pink-600 px-6 py-6 text-lg text-white hover:bg-pink-700 ${className}`}
        onClick={handleStartChat}
        disabled={isLoading || disabled}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <MessageCircle className="h-5 w-5" />
        )}
        {isLoading ? 'Starting Chat...' : 'Chat with Dottie'}
      </Button>

      {isFullscreenChatOpen && currentChatId && (
        <FullscreenChat
          onClose={handleCloseChat}
          setIsFullscreen={setIsFullscreenChatOpen}
          chatId={currentChatId}
          initialMessage={
            assessmentId
              ? `Hi! I've just completed my menstrual health assessment (ID: ${assessmentId}). My results show: ${PATTERN_DATA[pattern].title}. Can you tell me more about what this means and provide personalized recommendations?`
              : `Hi! I've just completed my menstrual health assessment. My results show: ${PATTERN_DATA[pattern].title}. Can you tell me more about what this means?`
          }
        />
      )}
    </>
  );
}

export default SendInitialMessageButton;
