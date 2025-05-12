import React from 'react';

interface AgeRangeProps {
  age: string | null;
}

export const AgeRange = ({ age }: AgeRangeProps) => {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
      <div>
        <img src="/resultAssets/time.svg" className="h-[55px] w-[55px]" alt="time-icon" />
      </div>
      <div>
        <h3 className="mb-2 text-lg font-medium">Age Range</h3>
        <p className="text-gray-600">{age || 'Not specified'}</p>
      </div>
    </div>
  );
};
