import React from 'react';
import { Button } from '@/src/components/buttons/button';
import { Plus } from 'lucide-react';

interface SidebarHeaderProps {
  onNewChat: () => void;
}

export function SidebarHeader({ onNewChat }: SidebarHeaderProps) {
  return (
    <div className="border-b border-gray-200 bg-gradient-to-r from-pink-50 to-white p-4 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat History</h2>
      </div>
    </div>
  );
}
