import React from 'react';
import { PATTERN_DATA } from '../../../../steps/context/types/recommendations';
import { MenstrualPattern } from '@/src/pages/assessment/steps/context/types';

interface PatternDisplayProps {
  pattern: MenstrualPattern;
  variant?: 'compact' | 'detailed';
  showDescription?: boolean;
}

export const PatternDisplay = ({ 
  pattern, 
  variant = 'detailed', 
  showDescription = true 
}: PatternDisplayProps) => {
  const patternInfo = PATTERN_DATA[pattern];

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 rounded-lg border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <img
          src={patternInfo.icon}
          className="h-12 w-12"
          alt={`${patternInfo.title} icon`}
        />
        <div>
          <h3 className="font-semibold text-pink-600 dark:text-pink-400">
            {patternInfo.title}
          </h3>
          {showDescription && (
            <p className="text-sm text-gray-600 dark:text-slate-300">
              {patternInfo.description}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Default detailed variant (same as DeterminedPattern)
  return (
    <div className="mb-8 text-center">
      <img
        src={patternInfo.icon}
        className="mx-auto mb-2 h-24 w-24"
        alt={`${patternInfo.title} icon`}
      />
      <h2 className="mb-2 text-2xl font-bold text-pink-600 dark:text-pink-400">
        {patternInfo.title}
      </h2>
      {showDescription && (
        <p className="mx-auto max-w-2xl text-gray-600 dark:text-slate-200">
          {patternInfo.description}
        </p>
      )}
    </div>
  );
}; 