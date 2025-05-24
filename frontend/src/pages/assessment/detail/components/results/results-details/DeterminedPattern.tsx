import React from 'react';
import { PATTERN_DATA } from '../../../../steps/context/types/recommendations';
import { MenstrualPattern } from '@/src/pages/assessment/steps/context/types';

interface DeterminedPatternProps {
  pattern: MenstrualPattern;
}

export const DeterminedPattern = ({ pattern }: DeterminedPatternProps) => {
  return (
    <div className="mb-8 text-center">
      <img
        src={PATTERN_DATA[pattern].icon}
        className="mx-auto mb-2 h-24 w-24"
        alt="menstrual-pattern-icon"
      />
      <h2 className="mb-2 text-2xl font-bold text-pink-600">{PATTERN_DATA[pattern].title}</h2>
      <p className="mx-auto max-w-2xl text-gray-600 dark:text-slate-200">
        {PATTERN_DATA[pattern].description}
      </p>
    </div>
  );
};
