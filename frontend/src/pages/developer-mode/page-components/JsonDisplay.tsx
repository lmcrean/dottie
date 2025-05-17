import React from 'react';

interface JsonDisplayProps {
  data: any;
  isExpected?: boolean;
}

/**
 * Component for displaying JSON data with syntax highlighting
 */
export default function JsonDisplay({ data, isExpected = false }: JsonDisplayProps) {
  // Convert data to formatted JSON string
  const formatJson = (data: any): string => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return 'Invalid JSON data';
    }
  };

  return (
    <div className={`rounded-md p-4 ${isExpected ? 'bg-gray-700' : 'bg-gray-700'}`}>
      <pre
        className={`whitespace-pre-wrap break-words text-sm ${isExpected ? 'text-gray-300' : 'text-white'}`}
      >
        {formatJson(data)}
      </pre>
    </div>
  );
}
