import React from 'react';

interface ErrorStateProps {
  error: string;
  title?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  title = 'Error',
  className = ''
}) => {
  return (
    <div
      className={`rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950 ${className}`}
    >
      {title && (
        <h3 className="mb-2 text-sm font-medium text-red-800 dark:text-red-400">{title}</h3>
      )}
      <p className="text-red-600 dark:text-red-300">{error}</p>
    </div>
  );
};
