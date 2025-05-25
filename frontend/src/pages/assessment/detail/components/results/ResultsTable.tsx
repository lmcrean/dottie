import React, { useEffect, useState } from 'react';
import { CardContent } from '@/src/components/ui/card';
import { AssessmentData } from '../../../steps/context/hooks/useAssessmentData';
import {
  AgeRange,
  CycleLength,
  PeriodDuration,
  FlowLevel,
  PainLevel,
  Symptoms,
  PatternRecommendations
} from './results-details';
import { Assessment } from '../../../api/types';
import DebugBox from './DebugBox';

interface ResultsTableProps {
  data?: AssessmentData;
  setIsClamped?: (value: boolean) => void;
  assessment?: Assessment;
  hasFlattenedFormat?: boolean;
  formatValue?: (value: string | undefined) => string;
  physicalSymptoms?: string[];
  emotionalSymptoms?: string[];
  otherSymptoms?: string[];
  recommendations?: { title: string; description: string }[];
}

export const ResultsTable = ({
  data,
  setIsClamped,
  assessment,
  hasFlattenedFormat,
  formatValue,
  physicalSymptoms = [],
  emotionalSymptoms = [],
  otherSymptoms = [],
  recommendations = []
}: ResultsTableProps) => {
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setShowDebug((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (data) {
    const { pattern, age, cycle_length, period_duration, flow_heaviness, pain_level } = data;

    return (
      <CardContent className="pb-8 pt-8">
        <div className="mb-8 grid grid-cols-1 items-start gap-6 dark:text-gray-900 md:grid-cols-2">
          <AgeRange age={age} />
          <CycleLength cycleLength={cycle_length} />
          <PeriodDuration periodDuration={period_duration} />
          <FlowLevel flowLevel={flow_heaviness} />
          <PainLevel painLevel={pain_level} pattern={pattern || 'regular'} />
          <Symptoms
            physicalSymptoms={data.physical_symptoms || []}
            emotionalSymptoms={data.emotional_symptoms || []}
            otherSymptoms={
              data.other_symptoms && data.other_symptoms.trim() !== ''
                ? [data.other_symptoms.trim()]
                : []
            }
            setIsClamped={setIsClamped!}
          />
        </div>

        <PatternRecommendations pattern={pattern || 'regular'} />

        <DebugBox assessmentData={data} isVisible={showDebug} />
      </CardContent>
    );
  }

  if (assessment) {
    const formatDisplayValue = (value: string | undefined | null): string => {
      if (formatValue && value) return formatValue(value);
      return value || 'N/A';
    };

    const pattern = hasFlattenedFormat ? assessment.pattern : assessment.assessment_data?.pattern;
    const displayAge = hasFlattenedFormat ? assessment.age : assessment.assessment_data?.age;
    const displayCycleLength = hasFlattenedFormat
      ? assessment.cycle_length
      : assessment.assessment_data?.cycleLength;
    const displayPeriodDuration = hasFlattenedFormat
      ? assessment.period_duration
      : assessment.assessment_data?.periodDuration;
    const displayFlowHeaviness = hasFlattenedFormat
      ? assessment.flow_heaviness
      : assessment.assessment_data?.flowHeaviness;
    const displayPainLevel = hasFlattenedFormat
      ? assessment.pain_level
      : assessment.assessment_data?.painLevel;

    const physical = physicalSymptoms || assessment.physical_symptoms || [];
    const emotional = emotionalSymptoms || assessment.emotional_symptoms || [];
    const other =
      Array.isArray(otherSymptoms) && otherSymptoms.length > 0
        ? otherSymptoms
        : Array.isArray(assessment.other_symptoms)
          ? assessment.other_symptoms
          : [];

    return (
      <div className="p-4">
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4 rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-medium text-pink-700">Basic Information</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-slate-200">
                <span className="font-medium dark:text-slate-100">Age:</span>{' '}
                {formatDisplayValue(displayAge)}
              </p>
              <p className="text-sm text-gray-600 dark:text-slate-200">
                <span className="font-medium dark:text-slate-100">Pattern:</span>{' '}
                {formatDisplayValue(pattern)}
              </p>
              <p className="text-sm text-gray-600 dark:text-slate-200">
                <span className="font-medium dark:text-slate-100">Cycle Length:</span>{' '}
                {formatDisplayValue(displayCycleLength)}
              </p>
              <p className="text-sm text-gray-600 dark:text-slate-200">
                <span className="font-medium dark:text-slate-100">Period Duration:</span>{' '}
                {formatDisplayValue(displayPeriodDuration)}
              </p>
            </div>
          </div>

          <div className="space-y-4 rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-medium text-pink-700">Flow & Pain</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-slate-200">
                <span className="font-medium dark:text-slate-100">Flow Level:</span>{' '}
                {formatDisplayValue(displayFlowHeaviness)}
              </p>
              <p className="text-sm text-gray-600 dark:text-slate-200">
                <span className="font-medium dark:text-slate-100">Pain Level:</span>{' '}
                {formatDisplayValue(displayPainLevel)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Symptoms
            physicalSymptoms={physical}
            emotionalSymptoms={emotional}
            otherSymptoms={other}
            setIsClamped={setIsClamped!}
          />

          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-slate-100">
              Recommendations
            </h3>
            <div className="space-y-4">
              {recommendations && recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="rounded-lg border bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <h4 className="text-xl font-medium text-pink-600 dark:text-pink-500">
                      {rec.title}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
                      {rec.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  No recommendations available.
                </p>
              )}
            </div>
          </div>

          <DebugBox
            assessmentId={assessment.id}
            assessmentData={assessment}
            isVisible={showDebug}
          />
        </div>
      </div>
    );
  }

  return null;
};
