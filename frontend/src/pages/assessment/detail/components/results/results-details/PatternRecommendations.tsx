import React from 'react';
import { PATTERN_DATA } from '../../../../steps/context/types/recommendations';
import { MenstrualPattern } from '@/src/pages/assessment/steps/context/types';

interface PatternRecommendationsProps {
  pattern: MenstrualPattern;
}

interface Recommendation {
  icon: string;
  title: string;
  description: string;
}

export const PatternRecommendations = ({ pattern }: PatternRecommendationsProps) => {
  return (
    <>
      <h3 className="mb-4 text-xl font-bold dark:text-slate-100">Recommendations</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {PATTERN_DATA[pattern].recommendations.map((rec: Recommendation, index: number) => (
          <div
            key={index}
            className="rounded-xl border p-4 transition-colors duration-300 hover:bg-pink-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{rec.icon}</div>
              <div>
                <h4 className="text-lg font-medium dark:text-slate-100">{rec.title}</h4>
                <p className="text-gray-600 dark:text-slate-300">{rec.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
