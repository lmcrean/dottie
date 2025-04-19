import React from 'react';
import { X } from 'lucide-react';

interface FullscreenChatProps {
  isOpen: boolean;
  onClose: () => void;
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
  initialMessage?: string;
}

export const FullscreenChat: React.FC<FullscreenChatProps> = ({ 
  isOpen, 
  onClose, 
  setIsFullscreen,
  initialMessage = "Hello! I'm Dottie. How can I help you understand your assessment results today?"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Chat with Dottie</h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4">
        {/* Chat messages would go here */}
        <div className="space-y-4">
          <div className="bg-pink-100 p-3 rounded-lg max-w-[80%]">
            <p>{initialMessage}</p>
          </div>
        </div>
      </div>
      
      <div className="border-t p-4">
        <div className="flex items-center">
          <input 
            type="text" 
            placeholder="Type your message..." 
            className="flex-grow p-3 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <button className="bg-pink-500 text-white p-3 rounded-r-md hover:bg-pink-600">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}; 