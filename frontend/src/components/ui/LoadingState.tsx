import React from 'react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  className = 'h-40'
}) => {
  return (
    <div className={`flex ${className} items-center justify-center`}>
      <p className="text-gray-500 dark:text-slate-400">{message}</p>
    </div>
  );
};
