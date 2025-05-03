import React from 'react';
import JsonDisplay from './JsonDisplay';

interface ApiResponseProps {
  data: any;
  status: 'idle' | 'success' | 'error' | 'partial';
}

/**
 * Component for displaying API responses with status indicators
 */
export default function ApiResponse({ data, status }: ApiResponseProps) {
  if (!data && status === 'idle') {
    return (
      <div className="rounded-md bg-gray-700 p-4 italic text-gray-400">
        No response yet. Click the endpoint button to test.
      </div>
    );
  }

  if (status === 'error') {
    // Format error response
    const errorMessage = data?.response?.data?.error || data?.message || 'An error occurred';

    const errorData = {
      error: errorMessage,
      status: data?.response?.status || 'Error'
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center">
          <div className="mr-2 h-2 w-2 rounded-full bg-red-500"></div>
          <span className="font-medium text-red-500">Error</span>
        </div>
        <JsonDisplay data={errorData} />
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="space-y-2">
        <div className="flex items-center">
          <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
          <span className="font-medium text-green-500">Success</span>
        </div>
        <JsonDisplay data={data} />
      </div>
    );
  }

  if (status === 'partial') {
    return (
      <div className="space-y-2">
        <div className="flex items-center">
          <div className="mr-2 h-2 w-2 rounded-full bg-yellow-500"></div>
          <span className="font-medium text-yellow-500">Partial Success</span>
        </div>
        <JsonDisplay data={data} />
      </div>
    );
  }

  return <JsonDisplay data={data} />;
}
