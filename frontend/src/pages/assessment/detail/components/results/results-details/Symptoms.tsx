import React, { useRef, useEffect } from 'react';

interface SymptomsProps {
  symptoms: string[];
  expandableSymptoms: boolean;
  setExpandableSymptoms: (value: boolean) => void;
  isClamped: boolean;
  setIsClamped: (value: boolean) => void;
  physicalSymptoms?: string[];
  emotionalSymptoms?: string[];
}

export const Symptoms = ({
  symptoms,
  expandableSymptoms,
  setExpandableSymptoms,
  isClamped,
  setIsClamped,
  physicalSymptoms = [],
  emotionalSymptoms = []
}: SymptomsProps) => {
  const ref = useRef<HTMLParagraphElement>(null);

  // Use either the combined symptoms or split between physical and emotional
  const displaySymptoms =
    symptoms.length > 0 ? symptoms : [...physicalSymptoms, ...emotionalSymptoms];

  useEffect(() => {
    if (ref.current) {
      const maxHeight = parseFloat(getComputedStyle(ref.current).lineHeight) * 2;
      setIsClamped(ref.current.scrollHeight > maxHeight);
    }
    // Remove setIsClamped from dependencies to prevent infinite loop
  }, [displaySymptoms]);

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-lg font-medium text-pink-700">Symptoms</h3>
      <div className="flex flex-wrap gap-2">
        {displaySymptoms.length > 0 ? (
          displaySymptoms.map((symptom, index) => (
            <span
              key={`symptom-${index}-${symptom}`}
              className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800 dark:bg-slate-700 dark:text-slate-200"
            >
              {symptom}
            </span>
          ))
        ) : (
          <span className="text-sm text-gray-500 dark:text-slate-400">No symptoms reported.</span>
        )}
      </div>

      {isClamped && (
        <button
          type="button"
          onClick={() => setExpandableSymptoms(!expandableSymptoms)}
          className="mt-2 text-sm text-pink-600 hover:text-pink-700"
          aria-expanded={expandableSymptoms}
          aria-controls="symptoms-content"
          data-testid="symptoms-toggle-button"
        >
          {expandableSymptoms ? 'View Less' : 'View More'}
        </button>
      )}
    </div>
  );
};
