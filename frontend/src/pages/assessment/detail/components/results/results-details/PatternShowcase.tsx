import React from 'react';
import { PatternIcon } from './PatternIcon';
import { PatternDisplay } from './PatternDisplay';
import { DeterminedPattern } from './DeterminedPattern';
import { MenstrualPattern } from '@/src/pages/assessment/steps/context/types';

/**
 * This component showcases all the different ways to display pattern information with icons.
 * It's mainly for demonstration and testing purposes.
 */
export const PatternShowcase = () => {
  const patterns: MenstrualPattern[] = ['regular', 'irregular', 'heavy', 'pain', 'developing'];

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
        Pattern Display Options
      </h2>

      {/* Icon sizes demonstration */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Pattern Icons (Different Sizes)</h3>
        <div className="grid grid-cols-5 gap-4">
          {patterns.map((pattern) => (
            <div key={pattern} className="text-center">
              <div className="mb-2 flex flex-col items-center space-y-2">
                <PatternIcon pattern={pattern} size="sm" />
                <PatternIcon pattern={pattern} size="md" />
                <PatternIcon pattern={pattern} size="lg" />
                <PatternIcon pattern={pattern} size="xl" />
              </div>
              <p className="text-sm capitalize text-gray-600 dark:text-slate-300">{pattern}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Compact pattern displays */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Compact Pattern Display</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {patterns.map((pattern) => (
            <PatternDisplay key={pattern} pattern={pattern} variant="compact" />
          ))}
        </div>
      </div>

      {/* Compact without description */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Compact Pattern Display (No Description)</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {patterns.map((pattern) => (
            <PatternDisplay
              key={pattern}
              pattern={pattern}
              variant="compact"
              showDescription={false}
            />
          ))}
        </div>
      </div>

      {/* Full pattern displays */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Full Pattern Display (Detailed)</h3>
        {patterns.map((pattern) => (
          <div key={pattern} className="mb-8">
            <DeterminedPattern pattern={pattern} />
            <hr className="my-6 border-gray-200 dark:border-slate-700" />
          </div>
        ))}
      </div>
    </div>
  );
}; 