import React from 'react';
import { patternData } from '../../utils/patternData';

interface DeterminedPatternProps {
  pattern: string;
}

export const DeterminedPattern = ({ pattern }: DeterminedPatternProps) => {
  return (
    <div className="mb-8 text-center">
      <img
        src={patternData[pattern].icon}
        className="mx-auto mb-2 h-24 w-24"
        alt="menstrual-pattern-icon"
      />
      <h2 className="mb-2 text-2xl font-bold text-pink-600">{patternData[pattern].title}</h2>
      <p className="mx-auto max-w-2xl text-gray-600 dark:text-slate-200">
        {patternData[pattern].description}
      </p>
    </div>
  );
};
