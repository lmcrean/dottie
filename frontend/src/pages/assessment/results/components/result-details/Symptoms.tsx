import React, { useRef, useEffect } from 'react';

interface SymptomsProps {
  symptoms: string[];
  expandableSymptoms: boolean;
  setExpandableSymptoms: (value: boolean) => void;
  isClamped: boolean;
  setIsClamped: (value: boolean) => void;
}

export const Symptoms = ({
  symptoms,
  expandableSymptoms,
  setExpandableSymptoms,
  isClamped,
  setIsClamped
}: SymptomsProps) => {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (ref.current) {
      const maxHeight = parseFloat(getComputedStyle(ref.current).lineHeight) * 2;
      setIsClamped(ref.current.scrollHeight > maxHeight);
    }
    // Remove setIsClamped from dependencies to prevent infinite loop
  }, [symptoms]);

  return (
    <div className="flex w-full max-w-full items-start gap-3 rounded-xl bg-gray-50 p-4">
      <div>
        <img
          src="/resultAssets/track-time.svg"
          className="h-[55px] w-[55px]"
          alt="track-time-icon"
        />
      </div>
      <div className="flex-1 overflow-x-auto">
        <h3 className="mb-2 text-lg font-medium">Symptoms</h3>
        <p
          id="symptoms-content"
          data-testid="symptoms-content"
          title={symptoms.length > 0 ? symptoms.join(', ') : 'None reported'}
          aria-label={symptoms.length > 0 ? symptoms.join(', ') : 'None reported'}
          ref={ref}
          className={`whitespace-normal break-words text-gray-600 ${expandableSymptoms ? '' : 'line-clamp-2'} whitespace-pre-line`}
        >
          {symptoms.length > 0 ? symptoms.join(', ') : 'None reported'}
        </p>

        {isClamped && (
          <button
            type="button"
            onClick={() => setExpandableSymptoms(!expandableSymptoms)}
            className="text-sm text-pink-600 hover:text-pink-700"
            aria-expanded={expandableSymptoms}
            aria-controls="symptoms-content"
            data-testid="symptoms-toggle-button"
          >
            {expandableSymptoms ? 'View Less' : 'View More'}
          </button>
        )}
      </div>
    </div>
  );
};
