import React from 'react';

interface CycleLengthProps {
  cycleLength: string | null;
}

export const CycleLength = ({ cycleLength }: CycleLengthProps) => {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
      <div>
        <img src="/resultAssets/calendar.svg" className="h-[55px] w-[55px]" alt="calendar-icon" />
      </div>
      <div>
        <h3 className="mb-2 text-lg font-medium">Cycle Length</h3>
        <p className="text-gray-600">{cycleLength || 'Not specified'}</p>
      </div>
    </div>
  );
};
