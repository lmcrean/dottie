import React from 'react';

export interface FullscreenChatProps { // this isn't needed -- the chat page is always fullscreen
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
