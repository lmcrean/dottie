import React, { useRef, useEffect } from 'react';

interface SymptomsProps {
  setIsClamped: (value: boolean) => void;
  physicalSymptoms?: string[];
  emotionalSymptoms?: string[];
  otherSymptoms?: string[];
}

const SymptomList: React.FC<{ items: string[]; categoryName: string }> = ({
  items,
  categoryName
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <h4 className="text-md mb-2 font-semibold text-gray-700 dark:text-slate-300">
        {categoryName}
      </h4>
      <div className="flex flex-wrap gap-2">
        {items.map((symptom, index) => (
          <span
            key={`symptom-${categoryName}-${index}-${symptom}`}
            className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800 dark:bg-slate-700 dark:text-slate-200"
          >
            {symptom}
          </span>
        ))}
      </div>
    </div>
  );
};

export const Symptoms = ({
  setIsClamped,
  physicalSymptoms = [],
  emotionalSymptoms = [],
  otherSymptoms = []
}: SymptomsProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      // TODO: Implement clamping logic if necessary
    }
  }, [physicalSymptoms, emotionalSymptoms, otherSymptoms, setIsClamped]);

  const hasAnySymptoms =
    physicalSymptoms.length > 0 || emotionalSymptoms.length > 0 || otherSymptoms.length > 0;

  return (
    <div
      ref={ref}
      className="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <h3 className="mb-4 text-lg font-medium text-pink-700">Symptoms Reported</h3>

      {!hasAnySymptoms && (
        <span className="text-sm text-gray-500 dark:text-slate-400">No symptoms reported.</span>
      )}

      {hasAnySymptoms && (
        <>
          <SymptomList items={physicalSymptoms} categoryName="Physical Symptoms" />
          <SymptomList items={emotionalSymptoms} categoryName="Emotional & Mood Symptoms" />
          <SymptomList items={otherSymptoms} categoryName="Other Symptoms" />
        </>
      )}
    </div>
  );
};
