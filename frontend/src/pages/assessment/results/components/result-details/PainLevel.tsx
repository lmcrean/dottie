import React from 'react';

interface PainLevelProps {
  painLevel: string | null;
  pattern: string;
}

export const PainLevel = ({ painLevel, pattern }: PainLevelProps) => {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
      <div>
        <img src="/resultAssets/emotion.svg" className="h-[55px] w-[55px]" alt="emotion-icon" />
      </div>
      <div>
        <h3 className="mb-2 text-lg font-medium">Pain Level</h3>
        <p
          className={`font-medium ${
            pattern === 'pain'
              ? 'text-red-600'
              : pattern === 'heavy'
                ? 'text-orange-600'
                : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {painLevel || 'Not specified'}
        </p>
      </div>
    </div>
  );
};
