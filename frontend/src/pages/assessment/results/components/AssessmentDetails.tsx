import { useRef, useEffect } from 'react';
import { CardContent } from '@/src/components/ui/card';
import { AssessmentData } from '../hooks/useAssessmentData';
import { patternData } from '../utils/patternData';

interface AssessmentDetailsProps {
  data: AssessmentData;
  setIsClamped: (value: boolean) => void;
  setExpandableSymptoms: (value: boolean) => void;
}

export const AssessmentDetails = ({
  data,
  setIsClamped,
  setExpandableSymptoms
}: AssessmentDetailsProps) => {
  const {
    pattern,
    age,
    cycleLength,
    periodDuration,
    flowLevel,
    painLevel,
    symptoms,
    expandableSymptoms
  } = data;
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (ref.current) {
      const maxHeight = parseFloat(getComputedStyle(ref.current).lineHeight) * 2;
      setIsClamped(ref.current.scrollHeight > maxHeight);
    }
  }, [symptoms, setIsClamped]);

  return (
    <CardContent className="pb-8 pt-8">
      <div className="mb-8 text-center">
        <img
          src={patternData[pattern].icon}
          className="mx-auto mb-2 h-24 w-24"
          alt="menstrual-pattern-icon"
        />
        <h2 className="mb-2 text-2xl font-bold text-pink-600">{patternData[pattern].title}</h2>
        <p className="mx-auto max-w-2xl text-gray-600 dark:text-slate-200">
          {patternData[pattern].description}
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 items-start gap-6 dark:text-gray-900 md:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
          <div>
            <img src="/resultAssets/time.svg" className="h-[55px] w-[55px]" alt="time-icon" />
          </div>
          <div>
            <h3 className="mb-2 text-lg font-medium">Age Range</h3>
            <p className="text-gray-600">{age || 'Not specified'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
          <div>
            <img
              src="/resultAssets/calendar.svg"
              className="h-[55px] w-[55px]"
              alt="calendar-icon"
            />
          </div>
          <div>
            <h3 className="mb-2 text-lg font-medium">Cycle Length</h3>
            <p className="text-gray-600">{cycleLength || 'Not specified'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
          <div>
            <img src="/resultAssets/drop.svg" className="h-[55px] w-[55px]" alt="drop-icon" />
          </div>
          <div>
            <h3 className="mb-2 text-lg font-medium">Period Duration</h3>
            <p className="text-gray-600">{periodDuration || 'Not specified'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
          <div>
            <img src="/resultAssets/d-drop.svg" className="h-[55px] w-[55px]" alt="d-drop-icon" />
          </div>
          <div>
            <h3 className="mb-2 text-lg font-medium">Flow Level</h3>
            <p className="text-gray-600">{flowLevel || 'Not specified'}</p>
          </div>
        </div>
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
              title={symptoms.length > 0 ? symptoms.join(', ') : 'None reported'}
              aria-label={symptoms.length > 0 ? symptoms.join(', ') : 'None reported'}
              ref={ref}
              className={`whitespace-normal break-words text-gray-600 ${expandableSymptoms ? '' : 'line-clamp-2'} whitespace-pre-line`}
            >
              {symptoms.length > 0 ? symptoms.join(', ') : 'None reported'}
            </p>

            {data.isClamped && (
              <button
                type="button"
                onClick={() => setExpandableSymptoms(!expandableSymptoms)}
                className="text-sm text-pink-600 hover:text-pink-700"
                aria-expanded={expandableSymptoms}
                aria-controls="symptoms-content"
              >
                {expandableSymptoms ? 'View Less' : 'View More'}
              </button>
            )}
          </div>
        </div>
      </div>

      <h3 className="mb-4 text-xl font-bold">Recommendations</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {patternData[pattern].recommendations.map((rec, index) => (
          <div
            key={index}
            className="rounded-xl border p-4 transition-colors duration-300 hover:bg-pink-50 dark:border-slate-800 dark:hover:text-gray-900"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{rec.icon}</div>
              <div>
                <h4 className="text-lg font-medium">{rec.title}</h4>
                <p className="text-gray-600">{rec.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  );
};
