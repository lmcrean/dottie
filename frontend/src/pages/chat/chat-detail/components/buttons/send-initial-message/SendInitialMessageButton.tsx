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
  const [initialMessage, setInitialMessage] = useState<string>('');

  const handleStartChat = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);

    try {
      // Generate initial message based on assessment
      const initialMessageText = assessmentId
        ? `Hi! I've just completed my menstrual health assessment (ID: ${assessmentId}). My results show: ${PATTERN_DATA[pattern].title}. Can you tell me more about what this means and provide personalized recommendations?`
        : `Hi! I've just completed my menstrual health assessment. My results show: ${PATTERN_DATA[pattern].title}. Can you tell me more about what this means?`;

      setInitialMessage(initialMessageText);

      // Log button click
      console.log(
        `[SendInitialMessageButton] Start chat clicked with assessmentId: ${assessmentId}, type: ${typeof assessmentId}`
      );
      console.log(`[SendInitialMessageButton] Initial message: "${initialMessageText}"`);

      // Ensure assessmentId is a string if it exists
      const assessmentIdString = assessmentId ? String(assessmentId) : undefined;

      // Log before API call
      console.log(
        `[SendInitialMessageButton] Creating new chat with assessment_id: ${assessmentIdString}, type: ${typeof assessmentIdString}`
      );

      // Create new chat
      const newChat = await createNewChat({
        assessment_id: assessmentIdString,
        initial_message: initialMessageText
      });

      // Carefully extract the ID, handling both string and object formats
      let chatIdString: string;

      // Debug what we received from the server
      console.log(`[SendInitialMessageButton] Received chat ID response:`, {
        value: newChat.id,
        type: typeof newChat.id,
        isObject: typeof newChat.id === 'object',
        stringRepresentation: String(newChat.id)
      });

      // Safely handle different ID formats with proper type checking
      if (typeof newChat.id === 'object' && newChat.id !== null) {
        // Type assertion to help TypeScript understand the structure
        const idObj = newChat.id as { id?: string; toString?: () => string };

        if (idObj.id) {
          chatIdString = String(idObj.id);
          console.log(
            `[SendInitialMessageButton] Extracted ID from object property: ${chatIdString}`
          );
        } else if (typeof idObj.toString === 'function' && idObj.toString() !== '[object Object]') {
          chatIdString = idObj.toString();
          console.log(`[SendInitialMessageButton] Used object's toString(): ${chatIdString}`);
        } else {
          console.error(
            '[SendInitialMessageButton] Cannot extract valid ID from response:',
            newChat.id
          );
          throw new Error('Received invalid chat ID format from server');
        }
      } else {
        // Just use normal string conversion for primitive values
        chatIdString = String(newChat.id);
      }

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
          message: initialMessageText
        });

        await sendInitialMessage({
          chat_id: chatIdString,
          assessment_id: assessmentIdString,
          message: initialMessageText
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
        onClick={handleStartChat}
        className={`${className} w-full`}
        variant="default"
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <MessageCircle className="mr-2 h-4 w-4" />
        )}
        Chat with Dottie
      </Button>

      {isFullscreenChatOpen && currentChatId && (
        <FullscreenChat
          chatId={currentChatId}
          onClose={handleCloseChat}
          setIsFullscreen={setIsFullscreenChatOpen}
          initialMessage={initialMessage}
        />
      )}
    </>
  );
}

export default SendInitialMessageButton;
