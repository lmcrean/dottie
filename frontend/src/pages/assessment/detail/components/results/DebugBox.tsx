import React from 'react';
import { Assessment } from '../../../api/types';
import { AssessmentData } from '../../../steps/context/hooks/useAssessmentData';

interface DebugBoxProps {
  assessmentId?: string;
  assessmentData?: Assessment | Record<string, unknown> | AssessmentData;
  isVisible?: boolean;
}

/**
 * Debug component for displaying assessment API request information
 * Similar to developer-mode components but specifically for assessment details
 */
const DebugBox: React.FC<DebugBoxProps> = ({ assessmentId, assessmentData, isVisible = false }) => {
  if (!isVisible) return null;

  // Log physical_symptoms when props are received
  if (assessmentData && 'physical_symptoms' in assessmentData) {
    // Debug logging would go here if needed
  }

  // Format JSON data for display
  const formatJson = (data: unknown): string => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return 'Invalid JSON data';
    }
  };

  // Extract timestamp if available
  const timestamp =
    assessmentData && 'created_at' in assessmentData && assessmentData.created_at
      ? new Date(assessmentData.created_at as string).toLocaleString()
      : 'N/A';

  // Build endpoint URL
  const endpoint = assessmentId ? `/api/assessment/${assessmentId}` : '/api/assessment/latest';

  return (
    <div className="mt-6 rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-medium text-gray-900 dark:text-white">
          API Debug Information
        </h3>
        <div className="flex items-center">
          <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-xs font-medium text-green-500">GET {endpoint}</span>
        </div>
      </div>

      <div className="mb-2 rounded-md bg-gray-800 p-2">
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
          <div>
            <span className="font-medium">Request Time:</span> {timestamp}
          </div>
          <div>
            <span className="font-medium">Assessment ID:</span> {assessmentId || 'N/A'}
          </div>
          <div>
            <span className="font-medium">User ID:</span>{' '}
            {assessmentData && 'user_id' in assessmentData
              ? (assessmentData.user_id as string)
              : 'N/A'}
          </div>
          <div>
            <span className="font-medium">Pattern:</span>{' '}
            {assessmentData && 'pattern' in assessmentData
              ? (assessmentData.pattern as string)
              : 'N/A'}
          </div>
        </div>
      </div>

      <div className="rounded-md bg-gray-700 p-4">
        <pre className="max-h-[400px] overflow-auto whitespace-pre-wrap break-words text-sm text-white">
          {formatJson(assessmentData)}
        </pre>
      </div>

      <div className="mt-2 text-right">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Press <kbd className="rounded bg-gray-200 px-1 py-0.5 text-xs dark:bg-gray-700">Ctrl</kbd>{' '}
          + <kbd className="rounded bg-gray-200 px-1 py-0.5 text-xs dark:bg-gray-700">Shift</kbd> +{' '}
          <kbd className="rounded bg-gray-200 px-1 py-0.5 text-xs dark:bg-gray-700">D</kbd> to
          toggle debug view
        </p>
      </div>
    </div>
  );
};

export default DebugBox;
