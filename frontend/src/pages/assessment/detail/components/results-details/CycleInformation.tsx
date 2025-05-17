import React from 'react';
import { Calendar } from 'lucide-react';
import { Assessment } from '@/src/pages/assessment/api/types';

interface CycleInformationProps {
  assessment: Assessment;
  hasFlattenedFormat: boolean;
  formatValue: (value: string | undefined) => string;
}

export const CycleInformation: React.FC<CycleInformationProps> = ({
  assessment,
  hasFlattenedFormat,
  formatValue
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-gray-400 dark:text-slate-200" />
        <span className="text-lg font-medium text-pink-700">Cycle Information</span>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600 dark:text-slate-200">
          <span className="font-medium">Age:</span>{' '}
          {formatValue(hasFlattenedFormat ? assessment.age : assessment.assessment_data?.age)}{' '}
          {/* Display "years" suffix as in the original detail page */}
          years
        </p>
        <p className="text-sm text-gray-600 dark:text-slate-200">
          <span className="font-medium">Cycle Length:</span>{' '}
          {/* Display "days" suffix as in the original detail page */}
          {formatValue(
            hasFlattenedFormat ? assessment.cycle_length : assessment.assessment_data?.cycleLength
          )}{' '}
          {/* Display "days" suffix as in the original detail page */}
          days
        </p>
        <p className="text-sm text-gray-600 dark:text-slate-200">
          <span className="font-medium">Period Duration:</span>{' '}
          {/* Display "days" suffix as in the original detail page */}
          {formatValue(
            hasFlattenedFormat
              ? assessment.period_duration
              : assessment.assessment_data?.periodDuration
          )}{' '}
          {/* Display "days" suffix as in the original detail page */}
          days
        </p>
      </div>
    </div>
  );
};
