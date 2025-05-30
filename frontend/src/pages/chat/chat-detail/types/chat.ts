import React from 'react';

export interface FullscreenChatProps {
  onClose: () => void;
  initialMessage?: string;
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
  chatId?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}
