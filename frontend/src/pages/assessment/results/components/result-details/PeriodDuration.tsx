import React from 'react';

interface PeriodDurationProps {
  periodDuration: string | null;
}

export const PeriodDuration = ({ periodDuration }: PeriodDurationProps) => {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
      <div>
        <img src="/resultAssets/drop.svg" className="h-[55px] w-[55px]" alt="drop-icon" />
      </div>
      <div>
        <h3 className="mb-2 text-lg font-medium">Period Duration</h3>
        <p className="text-gray-600">{periodDuration || 'Not specified'}</p>
      </div>
    </div>
  );
};
