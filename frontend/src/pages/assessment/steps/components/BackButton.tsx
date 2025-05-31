'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/src/components/buttons/button';
import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
  destination: string;
  text?: string;
  dataTestId?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  destination,
  text = 'Back',
  dataTestId = 'back-button'
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(destination);
  };

  return (
    <Button
      variant="outline"
      className="flex items-center px-6 py-6 text-lg dark:bg-gray-900 dark:text-pink-600 dark:hover:text-pink-700"
      onClick={handleBack}
      data-testid={dataTestId}
    >
      <ChevronLeft className="mr-2 h-5 w-5" />
      {text}
    </Button>
  );
};

export default BackButton;
