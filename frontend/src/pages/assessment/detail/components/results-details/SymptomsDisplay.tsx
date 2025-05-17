import React from 'react';

interface SymptomsDisplayProps {
  title: string;
  symptoms: string[];
  icon: React.ElementType;
}

export const SymptomsDisplay: React.FC<SymptomsDisplayProps> = ({
  title,
  symptoms,
  icon: Icon
}) => {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-gray-400" />
        <h2 className="text-lg font-medium text-pink-700">{title}</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {symptoms.length > 0 ? (
          symptoms.map((symptom: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800 dark:text-slate-200"
            >
              {symptom}
            </span>
          ))
        ) : (
          <span className="text-sm text-gray-500 dark:text-slate-200">
            No {title.toLowerCase().split(' ')[0]} symptoms reported{' '}
            {/* e.g. No physical symptoms reported */}
          </span>
        )}
      </div>
    </div>
  );
};
