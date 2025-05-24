'use client';

import React, { forwardRef, MouseEvent } from 'react';
import { Button } from '@/src/components/buttons/button';
import { ChevronRight } from 'lucide-react';

interface ContinueButtonProps {
  isEnabled: boolean;
  onContinue: () => void;
  text?: string;
  dataTestId?: string;
}

export const ContinueButton = forwardRef<HTMLButtonElement, ContinueButtonProps>(
  ({ isEnabled, onContinue, text = 'Continue', dataTestId = 'continue-button' }, ref) => {
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (isEnabled) {
        onContinue();
      }
    };

    return (
      <Button
        className={`flex items-center px-6 py-6 text-lg ${
          isEnabled
            ? 'bg-pink-600 text-white hover:bg-pink-700'
            : 'cursor-not-allowed bg-gray-300 text-gray-500'
        }`}
        disabled={!isEnabled}
        onClick={handleClick}
        ref={ref}
        data-testid={dataTestId}
        type="button"
      >
        {text}
        <ChevronRight className="ml-2 h-5 w-5" />
      </Button>
    );
  }
);

ContinueButton.displayName = 'ContinueButton';

export default ContinueButton;
