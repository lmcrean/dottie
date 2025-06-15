import React from 'react';
import { Button } from '@/src/components/buttons/button';
import { X, Minimize2 } from 'lucide-react';

interface ChatHeaderProps {
  onMinimize?: () => void;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export function ChatHeader({ onMinimize, onClose, showCloseButton = true }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b bg-gradient-to-r from-pink-50 to-white p-4 dark:from-gray-900 dark:to-black">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-pink-600">Chat with Dottie</h1>
      </div>
      <div>
        {onMinimize && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMinimize}
            className="rounded-full hover:bg-pink-100"
          >
            <Minimize2 className="h-4 w-4 text-pink-600" />
          </Button>
        )}
        {showCloseButton && onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-pink-100"
          >
            <X className="h-4 w-4 text-pink-600" />
          </Button>
        )}
      </div>
    </header>
  );
}
