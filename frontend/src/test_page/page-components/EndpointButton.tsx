import React from 'react';

interface EndpointButtonProps {
  label: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  onClick: () => void;
  status: 'idle' | 'success' | 'error' | 'partial';
  isLoading: boolean;
}

/**
 * Button component for triggering API calls with status indicator
 */
export default function EndpointButton({
  label,
  method,
  onClick,
  status,
  isLoading
}: EndpointButtonProps) {
  // Determine button color based on status
  const getButtonClass = () => {
    const baseClass =
      'w-full px-4 py-2 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

    if (status === 'success') return `${baseClass} bg-green-600 hover:bg-green-700`;
    if (status === 'error') return `${baseClass} bg-red-600 hover:bg-red-700`;
    if (status === 'partial') return `${baseClass} bg-yellow-600 hover:bg-yellow-700`;

    // Map HTTP methods to different colors
    const methodColors = {
      GET: 'bg-blue-600 hover:bg-blue-700',
      POST: 'bg-purple-600 hover:bg-purple-700',
      PUT: 'bg-amber-600 hover:bg-amber-700',
      DELETE: 'bg-rose-600 hover:bg-rose-700'
    };

    return `${baseClass} ${methodColors[method]}`;
  };

  // Format label with method highlight
  const formattedLabel = () => {
    const parts = label.split(' ');
    if (parts.length >= 2) {
      return (
        <>
          <span className="font-bold">{parts[0]}</span> {parts.slice(1).join(' ')}
        </>
      );
    }
    return label;
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={getButtonClass()}
      data-testid={`test-${label.toLowerCase().replace(/\//g, '-')}-button`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <svg
            className="h-5 w-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Testing...</span>
        </div>
      ) : (
        formattedLabel()
      )}
    </button>
  );
}
