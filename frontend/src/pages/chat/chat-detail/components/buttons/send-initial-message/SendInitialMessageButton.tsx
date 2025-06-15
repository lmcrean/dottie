import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/src/components/buttons/button';
import { MessageCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createNewChat } from '../../../../sidebar/api/create-new/api/createNewChat';
import { sendInitialMessage } from '../../../services/messages/messageService';
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
  const navigate = useNavigate();

  const handleStartChat = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);

    try {
      // Generate initial message based on assessment
      const initialMessageText = assessmentId
        ? `Hi! I've just completed my menstrual health assessment (ID: ${assessmentId}). My results show: ${PATTERN_DATA[pattern].title}. Can you tell me more about what this means and provide personalized recommendations?`
        : `Hi! I've just completed my menstrual health assessment. My results show: ${PATTERN_DATA[pattern].title}. Can you tell me more about what this means?`;

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

      // Log the raw response for debugging
      console.log(`[SendInitialMessageButton] Received chat ID response:`, {
        value: newChat.id,
        type: typeof newChat.id,
        isObject: typeof newChat.id === 'object',
        stringRepresentation: String(newChat.id)
      });

      if (typeof newChat.id === 'string') {
        chatIdString = newChat.id;
      } else if (typeof newChat.id === 'object' && newChat.id !== null) {
        // Handle object format responses
        const idObj = newChat.id as {
          id?: string | number;
          conversationId?: string | number;
          toString?: () => string;
        };
        if (idObj.id) {
          chatIdString = String(idObj.id);
        } else if (idObj.conversationId) {
          chatIdString = String(idObj.conversationId);
        } else if (idObj.toString && typeof idObj.toString === 'function') {
          chatIdString = idObj.toString();
        } else {
          chatIdString = String(newChat.id);
        }
      } else {
        chatIdString = String(newChat.id);
      }

      // Ensure we have a valid string ID
      chatIdString = String(chatIdString);

      // Log successful chat creation
      console.log(
        `[SendInitialMessageButton] Chat created successfully, received ID: ${chatIdString}, type: ${typeof chatIdString}`
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

      // Navigate to the new chat route
      console.log(`[SendInitialMessageButton] Navigating to /chat/${chatIdString}`);
      navigate(`/chat/${chatIdString}`);
    } catch (error) {
      console.error('[SendInitialMessageButton] Error starting chat:', error);
      toast.error('Failed to start chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleStartChat}
      className={`gap-2 ${className}`}
      variant="default"
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <MessageCircle className="h-4 w-4" />
      )}
      Chat with Dottie
    </Button>
  );
}

export default SendInitialMessageButton;
