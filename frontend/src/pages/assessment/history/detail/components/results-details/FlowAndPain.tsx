import React from 'react';
import { Activity } from 'lucide-react';
import { Assessment } from '@/src/pages/assessment/api/types';

interface FlowAndPainProps {
  assessment: Assessment;
  hasFlattenedFormat: boolean;
  formatValue: (value: string | undefined) => string;
}

export const FlowAndPain: React.FC<FlowAndPainProps> = ({
  assessment,
  hasFlattenedFormat,
  formatValue
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-gray-400" />
        <span className="text-lg font-medium text-pink-700">Flow & Pain</span>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600 dark:text-slate-200">
          <span className="font-medium">Flow Level:</span>{' '}
          {formatValue(
            hasFlattenedFormat
              ? assessment.flow_heaviness
              : assessment.assessment_data?.flowHeaviness
          )}
        </p>
        <p className="text-sm text-gray-600 dark:text-slate-200">
          <span className="font-medium">Pain Level:</span>{' '}
          {formatValue(
            hasFlattenedFormat ? assessment.pain_level : assessment.assessment_data?.painLevel
          )}
        </p>
      </div>
    </div>
  );
};
