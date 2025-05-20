import React from 'react';
import { MenstrualPattern } from '@/src/pages/assessment/steps/context/types';

interface PainLevelProps {
  painLevel: string | null;
  pattern: MenstrualPattern;
}

export const PainLevel = ({ painLevel, pattern }: PainLevelProps) => {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 dark:border dark:border-slate-700 dark:bg-slate-800">
      <div>
        <img src="/resultAssets/emotion.svg" className="h-[55px] w-[55px]" alt="emotion-icon" />
      </div>
      <div>
        <h3 className="mb-2 text-lg font-medium dark:text-slate-100">Pain Level</h3>
        <p
          className={`font-medium ${
            pattern === 'pain'
              ? 'text-red-600'
              : pattern === 'heavy'
                ? 'text-orange-600'
                : 'text-gray-700 dark:text-gray-300'
          }`}
          data-testid="pain-level-value"
        >
          {painLevel || 'Not specified'}
        </p>
      </div>
    </div>
  );
};
