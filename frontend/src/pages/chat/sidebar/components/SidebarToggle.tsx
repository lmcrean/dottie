import React from 'react';
import { Button } from '@/src/components/buttons/button';
import { Menu, X } from 'lucide-react';

interface SidebarToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
  showCloseIcon?: boolean;
}

export function SidebarToggle({
  isOpen,
  onToggle,
  className = '',
  showCloseIcon = false
}: SidebarToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className={`rounded-full hover:bg-pink-100 ${className}`}
      aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
    >
      {showCloseIcon && isOpen ? (
        <X className="h-4 w-4 text-pink-600" />
      ) : (
        <Menu className="h-4 w-4 text-pink-600" />
      )}
    </Button>
  );
}
