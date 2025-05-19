import React from 'react';

interface AgeRangeProps {
  age: string | null;
}

// Map raw age values to display text
const ageDisplayMap: Record<string, string> = {
  'under-13': 'Under 13 years',
  '13-17': '13-17 years',
  '18-24': '18-24 years',
  '25-plus': '25+ years'
};

export const AgeRange = ({ age }: AgeRangeProps) => {
  // Convert raw age value to display text
  const displayAge = age && ageDisplayMap[age] ? ageDisplayMap[age] : age;

  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
      <div>
        <img src="/resultAssets/time.svg" className="h-[55px] w-[55px]" alt="time-icon" />
      </div>
      <div>
        <h3 className="mb-2 text-lg font-medium">Age Range</h3>
        <p className="text-gray-600" data-testid="age-value">
          {displayAge || 'Not specified'}
        </p>
      </div>
    </div>
  );
};
